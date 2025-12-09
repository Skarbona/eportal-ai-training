import { NotificationsEnum } from './enum';
import { Notification } from '../../models/notification';

export interface InitFetchNotifications {
  type: NotificationsEnum.InitFetchNotifications;
}

export interface SuccessFetchNotifications {
  type: NotificationsEnum.SuccessFetchNotifications;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

export interface FailFetchNotifications {
  type: NotificationsEnum.FailFetchNotifications;
  data: {
    error: Error;
  };
}

export interface AddNotification {
  type: NotificationsEnum.AddNotification;
  data: {
    notification: Notification;
  };
}

export interface MarkAsRead {
  type: NotificationsEnum.MarkAsRead;
  data: {
    notificationId: string;
  };
}

export interface MarkAllAsRead {
  type: NotificationsEnum.MarkAllAsRead;
}

export interface DeleteNotification {
  type: NotificationsEnum.DeleteNotification;
  data: {
    notificationId: string;
  };
}

export interface UpdateUnreadCount {
  type: NotificationsEnum.UpdateUnreadCount;
  data: {
    count: number;
  };
}

export interface CleanNotificationsAlerts {
  type: NotificationsEnum.CleanNotificationsAlerts;
}

export type NotificationsActions =
  | InitFetchNotifications
  | SuccessFetchNotifications
  | FailFetchNotifications
  | AddNotification
  | MarkAsRead
  | MarkAllAsRead
  | DeleteNotification
  | UpdateUnreadCount
  | CleanNotificationsAlerts;

