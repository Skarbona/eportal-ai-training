import { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import ChatRoom from '../models/chat-room';
import Message, { MessageType } from '../models/message';
import User from '../models/user';
import { logControllerError } from '../utils/error-logs';

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, type, participants } = req.body;
  const { userId, email } = req.userData;

  try {
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return next(new HttpError('Participants are required', 400));
    }

    // Validate all participants exist
    const participantUsers = await User.find({ _id: { $in: participants } });
    if (participantUsers.length !== participants.length) {
      return next(new HttpError('Some participants do not exist', 400));
    }

    // For private chats, check if room already exists
    if (type === 'private') {
      if (participants.length !== 2) {
        return next(new HttpError('Private chat must have exactly 2 participants', 400));
      }

      const existingRoom = await ChatRoom.findOne({
        type: 'private',
        participants: { $all: participants, $size: 2 },
      });

      if (existingRoom) {
        return res.json({
          room: existingRoom.toObject({ getters: true }),
          existed: true,
        });
      }
    }

    // Sanitize room name
    const sanitizedName = sanitizeHtml(name, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Create room
    const room = new ChatRoom({
      name: sanitizedName || `Chat ${Date.now()}`,
      type,
      participants,
      createdBy: userId,
    });

    await room.save();

    // Create system message
    const systemMessage = new Message({
      roomId: room.id,
      senderId: userId,
      senderName: 'System',
      content: `${email.split('@')[0]} created the chat`,
      type: MessageType.System,
    });

    await systemMessage.save();

    res.status(201).json({
      room: room.toObject({ getters: true }),
      existed: false,
    });
  } catch (e) {
    logControllerError('createRoom', e);
    return next(new HttpError('Error creating chat room', 500));
  }
};

export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.userData;

  try {
    const rooms = await ChatRoom.find({
      participants: userId,
    })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'name email')
      .lean();

    res.json({
      rooms,
    });
  } catch (e) {
    logControllerError('getRooms', e);
    return next(new HttpError('Error fetching chat rooms', 500));
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId } = req.params;
  const { userId } = req.userData;

  try {
    const room = await ChatRoom.findById(roomId).populate('participants', 'name email');

    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    if (!room.isParticipant(userId)) {
      return next(new HttpError('Access denied to this chat room', 403));
    }

    res.json({
      room: room.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('getRoom', e);
    return next(new HttpError('Error fetching chat room', 500));
  }
};

export const addParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId } = req.params;
  const { participantId } = req.body;
  const { userId, email } = req.userData;

  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    // Only group chats can add participants
    if (room.type !== 'group') {
      return next(new HttpError('Can only add participants to group chats', 400));
    }

    // Verify user is participant
    if (!room.isParticipant(userId)) {
      return next(new HttpError('Access denied', 403));
    }

    // Verify new participant exists
    const newParticipant = await User.findById(participantId);
    if (!newParticipant) {
      return next(new HttpError('User not found', 404));
    }

    // Check if already a participant
    if (room.isParticipant(participantId)) {
      return next(new HttpError('User is already a participant', 400));
    }

    room.participants.push(mongoose.Types.ObjectId(participantId));
    await room.save();

    // Create system message
    const systemMessage = new Message({
      roomId: room.id,
      senderId: userId,
      senderName: 'System',
      content: `${email.split('@')[0]} added ${newParticipant.name} to the chat`,
      type: MessageType.System,
    });

    await systemMessage.save();

    res.json({
      room: room.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('addParticipant', e);
    return next(new HttpError('Error adding participant', 500));
  }
};

export const leaveRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { roomId } = req.params;
  const { userId, email } = req.userData;

  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return next(new HttpError('Chat room not found', 404));
    }

    if (!room.isParticipant(userId)) {
      return next(new HttpError('You are not a participant', 400));
    }

    // Remove user from participants
    room.participants = room.participants.filter((p) => p.toString() !== userId);

    // If no participants left, delete the room
    if (room.participants.length === 0) {
      await room.remove();
      await Message.deleteMany({ roomId: room.id });
      return res.json({ message: 'Room deleted as no participants remain' });
    }

    await room.save();

    // Create system message
    const systemMessage = new Message({
      roomId: room.id,
      senderId: userId,
      senderName: 'System',
      content: `${email.split('@')[0]} left the chat`,
      type: MessageType.System,
    });

    await systemMessage.save();

    res.json({ message: 'Left the chat room successfully' });
  } catch (e) {
    logControllerError('leaveRoom', e);
    return next(new HttpError('Error leaving chat room', 500));
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { query } = req.query;
  const { userId } = req.userData;

  try {
    if (!query || (query as string).length < 2) {
      return next(new HttpError('Query must be at least 2 characters', 400));
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name email')
      .limit(10)
      .lean();

    res.json({ users });
  } catch (e) {
    logControllerError('searchUsers', e);
    return next(new HttpError('Error searching users', 500));
  }
};

