import axios from 'axios';

import { AppThunk } from '../../store.interface';
import { BACKEND_API } from '../../../constants/envs';
import { GameSessionData } from '../../../models/leaderboard';

export const createGameSession =
  (sessionData: GameSessionData): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.post(`${BACKEND_API}/game-sessions`, sessionData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return data.session;
    } catch (e) {
      console.error('Error creating game session:', e);
      throw e;
    }
  };

export const completeGameSession =
  (sessionId: string, points: any, tasksCompleted: number, duration: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.patch(
        `${BACKEND_API}/game-sessions/${sessionId}/complete`,
        {
          points,
          tasksCompleted,
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      
      return data.session;
    } catch (e) {
      console.error('Error completing game session:', e);
      throw e;
    }
  };

