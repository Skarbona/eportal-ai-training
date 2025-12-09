import { Notification } from '../../models/notification';
import { AlertTypes } from '../../models/alerts';

export interface NotificationsStateInterface {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  alertType: AlertTypes;
  // TODO: Add hasMore for pagination
  // hasMore: boolean;
}

export const notificationsInitialState: NotificationsStateInterface = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  alertType: null,
};

