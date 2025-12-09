import axios from 'axios';

import * as A from '../action';
import { AppThunk } from '../../store.interface';
import { BACKEND_API } from '../../../constants/envs';

export const fetchNotifications =
  (limit = 20, skip = 0, unreadOnly = false): AppThunk =>
  async (dispatch, getState) => {
    dispatch(A.initFetchNotifications());
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.get(
        `${BACKEND_API}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.successFetchNotifications(data.notifications, data.unreadCount));
    } catch (e) {
      dispatch(A.failFetchNotifications(e));
    }
  };

export const markNotificationAsRead =
  (notificationId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.patch(
        `${BACKEND_API}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.markAsRead(notificationId));
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

export const markAllNotificationsAsRead = (): AppThunk => async (dispatch, getState) => {
  try {
    const { accessToken } = getState().app.auth;
    await axios.post(
      `${BACKEND_API}/notifications/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    dispatch(A.markAllAsRead());
  } catch (e) {
    console.error('Error marking all as read:', e);
  }
};

export const deleteNotificationThunk =
  (notificationId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.delete(`${BACKEND_API}/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(A.deleteNotification(notificationId));
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

// TODO: Implement real-time notifications with WebSocket
// export const subscribeToNotifications = (): AppThunk => async (dispatch, getState) => {
//   const { userId } = getState().user.userData;
//   const socket = io(BACKEND_API);
//   
//   socket.on('new_notification', (notification) => {
//     dispatch(A.addNotification(notification));
//   });
//   
//   return () => socket.disconnect();
// };

