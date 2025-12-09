import { NextFunction, Request, Response } from 'express';

import HttpError from '../models/http-error';
import Notification from '../models/notification';
import { logControllerError } from '../utils/error-logs';

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.userData;
  const { limit = 20, skip = 0, unreadOnly = false } = req.query;

  try {
    const filter: any = { userId };
    if (unreadOnly === 'true') {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string, 10))
      .skip(parseInt(skip as string, 10))
      .lean();

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === parseInt(limit as string, 10),
    });
  } catch (e) {
    logControllerError('getNotifications', e);
    return next(new HttpError('Error fetching notifications', 500));
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { notificationId } = req.params;
  const { userId } = req.userData;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new HttpError('Notification not found', 404));
    }

    // Verify ownership
    if (notification.userId.toString() !== userId) {
      return next(new HttpError('Access denied', 403));
    }

    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      await notification.save();
    }

    res.json({
      notification: notification.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('markAsRead', e);
    return next(new HttpError('Error marking notification as read', 500));
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.userData;

  try {
    await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (e) {
    logControllerError('markAllAsRead', e);
    return next(new HttpError('Error marking all as read', 500));
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { notificationId } = req.params;
  const { userId } = req.userData;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new HttpError('Notification not found', 404));
    }

    if (notification.userId.toString() !== userId) {
      return next(new HttpError('Access denied', 403));
    }

    await notification.remove();

    res.json({ message: 'Notification deleted' });
  } catch (e) {
    logControllerError('deleteNotification', e);
    return next(new HttpError('Error deleting notification', 500));
  }
};

// TODO: Implement batch delete for multiple notifications
// export const deleteMultiple = async (req, res, next) => { ... }

// TODO: Implement notification preferences
// export const updatePreferences = async (req, res, next) => { ... }

// Helper function to create notifications (used by other controllers)
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any,
): Promise<void> => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data,
    });
    await notification.save();
    
    // TODO: Emit socket event for real-time notification
    // io.to(userId).emit('new_notification', notification);
  } catch (e) {
    logControllerError('createNotification', e);
  }
};

