import { NotificationsEnum } from './enum';
import * as I from './action.interface';
import { Notification } from '../../models/notification';

export const initFetchNotifications = (): I.InitFetchNotifications => ({
  type: NotificationsEnum.InitFetchNotifications,
});

export const successFetchNotifications = (
  notifications: Notification[],
  unreadCount: number,
): I.SuccessFetchNotifications => ({
  type: NotificationsEnum.SuccessFetchNotifications,
  data: { notifications, unreadCount },
});

export const failFetchNotifications = (error: Error): I.FailFetchNotifications => ({
  type: NotificationsEnum.FailFetchNotifications,
  data: { error },
});

export const addNotification = (notification: Notification): I.AddNotification => ({
  type: NotificationsEnum.AddNotification,
  data: { notification },
});

export const markAsRead = (notificationId: string): I.MarkAsRead => ({
  type: NotificationsEnum.MarkAsRead,
  data: { notificationId },
});

export const markAllAsRead = (): I.MarkAllAsRead => ({
  type: NotificationsEnum.MarkAllAsRead,
});

export const deleteNotification = (notificationId: string): I.DeleteNotification => ({
  type: NotificationsEnum.DeleteNotification,
  data: { notificationId },
});

export const updateUnreadCount = (count: number): I.UpdateUnreadCount => ({
  type: NotificationsEnum.UpdateUnreadCount,
  data: { count },
});

export const cleanNotificationsAlerts = (): I.CleanNotificationsAlerts => ({
  type: NotificationsEnum.CleanNotificationsAlerts,
});

