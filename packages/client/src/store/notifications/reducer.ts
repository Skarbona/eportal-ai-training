import { NotificationsActions } from './action.interface';
import { NotificationsEnum } from './enum';
import { notificationsInitialState } from './initialState';
import { NotificationsStateInterface } from './initialState.interface';
import { AlertTypes } from '../../models/alerts';

const notificationsReducer = (
  state = notificationsInitialState,
  action: NotificationsActions,
): NotificationsStateInterface => {
  switch (action.type) {
    case NotificationsEnum.InitFetchNotifications:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case NotificationsEnum.SuccessFetchNotifications: {
      const { notifications, unreadCount } = action.data;
      return {
        ...state,
        loading: false,
        notifications,
        unreadCount,
      };
    }

    case NotificationsEnum.FailFetchNotifications: {
      const { error } = action.data;
      return {
        ...state,
        loading: false,
        error,
        alertType: AlertTypes.ServerError,
      };
    }

    case NotificationsEnum.AddNotification: {
      const { notification } = action.data;
      return {
        ...state,
        notifications: [notification, ...state.notifications],
        unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
      };
    }

    case NotificationsEnum.MarkAsRead: {
      const { notificationId } = action.data;
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }

    case NotificationsEnum.MarkAllAsRead:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
          readAt: n.readAt || new Date().toISOString(),
        })),
        unreadCount: 0,
      };

    case NotificationsEnum.DeleteNotification: {
      const { notificationId } = action.data;
      const deletedNotification = state.notifications.find((n) => n.id === notificationId);
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount:
          deletedNotification && !deletedNotification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }

    case NotificationsEnum.UpdateUnreadCount: {
      const { count } = action.data;
      return {
        ...state,
        unreadCount: count,
      };
    }

    case NotificationsEnum.CleanNotificationsAlerts:
      return {
        ...state,
        error: null,
        alertType: null,
      };

    default:
      return state;
  }
};

export default notificationsReducer;

