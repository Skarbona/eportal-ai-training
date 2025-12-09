import { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

import HttpError from '../models/http-error';
import Message, { MessageType } from '../models/message';
import ChatRoom from '../models/chat-room';
import { logControllerError } from '../utils/error-logs';

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId } = req.params;
  const { limit = 50, skip = 0 } = req.query;
  const { userId } = req.userData;

  try {
    // Verify user is participant of the room
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    if (!room.isParticipant(userId)) {
      return next(new HttpError('Access denied to this chat room', 403));
    }

    const messages = await Message.find({
      roomId,
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string, 10))
      .skip(parseInt(skip as string, 10))
      .lean();

    res.json({
      messages: messages.reverse(),
      hasMore: messages.length === parseInt(limit as string, 10),
    });
  } catch (e) {
    logControllerError('getMessages', e);
    return next(new HttpError('Error fetching messages', 500));
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId, content } = req.body;
  const { userId, email } = req.userData;

  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      return next(new HttpError('Message content cannot be empty', 400));
    }

    if (content.length > 2000) {
      return next(new HttpError('Message too long (max 2000 characters)', 400));
    }

    // Verify room exists and user is participant
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    if (!room.isParticipant(userId)) {
      return next(new HttpError('Access denied to this chat room', 403));
    }

    // Sanitize content
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Create message
    const message = new Message({
      roomId,
      senderId: userId,
      senderName: email.split('@')[0],
      content: sanitizedContent,
      type: MessageType.Text,
      readBy: [userId],
    });

    await message.save();

    // Update room's last message
    room.lastMessageAt = new Date();
    room.lastMessage = sanitizedContent.substring(0, 200);
    await room.save();

    res.status(201).json({
      message: message.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('sendMessage', e);
    return next(new HttpError('Error sending message', 500));
  }
};

export const editMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { messageId } = req.params;
  const { content } = req.body;
  const { userId } = req.userData;

  try {
    if (!content || content.trim().length === 0) {
      return next(new HttpError('Message content cannot be empty', 400));
    }

    if (content.length > 2000) {
      return next(new HttpError('Message too long (max 2000 characters)', 400));
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return next(new HttpError('Message not found', 404));
    }

    // Verify user owns the message
    if (message.senderId.toString() !== userId) {
      return next(new HttpError('You can only edit your own messages', 403));
    }

    // Cannot edit deleted messages
    if (message.deleted) {
      return next(new HttpError('Cannot edit deleted message', 400));
    }

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    message.content = sanitizedContent;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({
      message: message.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('editMessage', e);
    return next(new HttpError('Error editing message', 500));
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { messageId } = req.params;
  const { userId } = req.userData;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return next(new HttpError('Message not found', 404));
    }

    // Verify user owns the message
    if (message.senderId.toString() !== userId) {
      return next(new HttpError('You can only delete your own messages', 403));
    }

    message.deleted = true;
    message.content = '[Message deleted]';
    await message.save();

    res.json({
      message: 'Message deleted successfully',
    });
  } catch (e) {
    logControllerError('deleteMessage', e);
    return next(new HttpError('Error deleting message', 500));
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId } = req.params;
  const { userId } = req.userData;

  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    if (!room.isParticipant(userId)) {
      return next(new HttpError('Access denied', 403));
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        roomId,
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      },
    );

    res.json({ message: 'Messages marked as read' });
  } catch (e) {
    logControllerError('markAsRead', e);
    return next(new HttpError('Error marking messages as read', 500));
  }
};

