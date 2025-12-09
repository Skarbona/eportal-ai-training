import axios from 'axios';

import * as A from '../action';
import { AppThunk } from '../../store.interface';
import { BACKEND_API } from '../../../constants/envs';
import { CreateRoomPayload } from '../../../models/chat';

export const createRoom =
  (payload: CreateRoomPayload): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.post(`${BACKEND_API}/chat-rooms`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!data.existed) {
        dispatch(A.addRoom(data.room));
      }

      return data.room;
    } catch (e) {
      console.error('Error creating room:', e);
      throw e;
    }
  };

export const addParticipant =
  (roomId: string, participantId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.post(
        `${BACKEND_API}/chat-rooms/${roomId}/participants`,
        { participantId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Optionally refetch room or update locally
    } catch (e) {
      console.error('Error adding participant:', e);
      throw e;
    }
  };

export const leaveRoom =
  (roomId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      await axios.delete(`${BACKEND_API}/chat-rooms/${roomId}/leave`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Refetch rooms
      dispatch(fetchRooms());
    } catch (e) {
      console.error('Error leaving room:', e);
      throw e;
    }
  };

export const searchUsers =
  (query: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.get(`${BACKEND_API}/chat-rooms/search-users?query=${query}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data.users;
    } catch (e) {
      console.error('Error searching users:', e);
      throw e;
    }
  };

// Import fetchRooms from messages.ts
import { fetchRooms } from './messages';

