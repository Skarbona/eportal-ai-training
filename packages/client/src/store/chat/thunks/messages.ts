import axios from 'axios';

import * as A from '../action';
import { AppThunk } from '../../store.interface';
import { BACKEND_API } from '../../../constants/envs';
import { SendMessagePayload } from '../../../models/chat';

export const fetchRooms = (): AppThunk => async (dispatch, getState) => {
  dispatch(A.initFetchRooms());
  try {
    const { accessToken } = getState().app.auth;
    const { data } = await axios.get(`${BACKEND_API}/chat-rooms`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(A.successFetchRooms(data.rooms));
  } catch (e) {
    dispatch(A.failFetchRooms(e));
  }
};

export const fetchMessages =
  (roomId: string, limit = 50, skip = 0): AppThunk =>
  async (dispatch, getState) => {
    dispatch(A.initFetchMessages());
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.get(
        `${BACKEND_API}/messages/${roomId}?limit=${limit}&skip=${skip}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.successFetchMessages(roomId, data.messages, data.hasMore));
    } catch (e) {
      dispatch(A.failFetchMessages(e));
    }
  };

export const sendMessage =
  (payload: SendMessagePayload): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.post(`${BACKEND_API}/messages`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(A.addMessage(data.message));
      return data.message;
    } catch (e) {
      console.error('Error sending message:', e);
      throw e;
    }
  };

export const editMessage =
  (messageId: string, content: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.patch(
        `${BACKEND_API}/messages/${messageId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.updateMessage(data.message));
    } catch (e) {
      console.error('Error editing message:', e);
      throw e;
    }
  };

export const deleteMessageThunk =
  (messageId: string, roomId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.delete(`${BACKEND_API}/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(A.deleteMessage(messageId, roomId));
    } catch (e) {
      console.error('Error deleting message:', e);
      throw e;
    }
  };

export const markAsRead =
  (roomId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.post(
        `${BACKEND_API}/messages/${roomId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.clearUnreadCount(roomId));
    } catch (e) {
      console.error('Error marking as read:', e);
    }
  };

