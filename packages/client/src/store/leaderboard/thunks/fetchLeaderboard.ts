import axios from 'axios';

import * as A from '../action';
import { AppThunk } from '../../store.interface';
import { BACKEND_API } from '../../../constants/envs';
import { LeaderboardPeriod } from '../../../models/leaderboard';

export const fetchLeaderboard =
  (period: LeaderboardPeriod = LeaderboardPeriod.ALL, limit = 100): AppThunk =>
  async (dispatch) => {
    dispatch(A.initFetchLeaderboard());
    try {
      const { data } = await axios.get(
        `${BACKEND_API}/leaderboard/global?period=${period}&limit=${limit}`,
      );
      dispatch(A.successFetchLeaderboard(data.leaderboard, period));
    } catch (e) {
      dispatch(A.failFetchLeaderboard(e));
    }
  };

export const fetchUserRank =
  (userId: string, period: LeaderboardPeriod = LeaderboardPeriod.ALL): AppThunk =>
  async (dispatch, getState) => {
    dispatch(A.initFetchUserRank());
    try {
      const { accessToken } = getState().app.auth;
      const { data } = await axios.get(
        `${BACKEND_API}/leaderboard/user/${userId}/rank?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(A.successFetchUserRank(data));
    } catch (e) {
      dispatch(A.failFetchUserRank(e));
    }
  };

