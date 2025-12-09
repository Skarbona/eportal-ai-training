import { LeaderboardEnum } from './enum';
import * as I from './action.interface';
import { LeaderboardEntry, UserRank, LeaderboardPeriod } from '../../models/leaderboard';

export const initFetchLeaderboard = (): I.InitFetchLeaderboard => ({
  type: LeaderboardEnum.InitFetchLeaderboard,
});

export const successFetchLeaderboard = (
  leaderboard: LeaderboardEntry[],
  period: LeaderboardPeriod,
): I.SuccessFetchLeaderboard => ({
  type: LeaderboardEnum.SuccessFetchLeaderboard,
  data: { leaderboard, period },
});

export const failFetchLeaderboard = (error: Error): I.FailFetchLeaderboard => ({
  type: LeaderboardEnum.FailFetchLeaderboard,
  data: { error },
});

export const initFetchUserRank = (): I.InitFetchUserRank => ({
  type: LeaderboardEnum.InitFetchUserRank,
});

export const successFetchUserRank = (userRank: UserRank): I.SuccessFetchUserRank => ({
  type: LeaderboardEnum.SuccessFetchUserRank,
  data: { userRank },
});

export const failFetchUserRank = (error: Error): I.FailFetchUserRank => ({
  type: LeaderboardEnum.FailFetchUserRank,
  data: { error },
});

export const setSelectedPeriod = (period: LeaderboardPeriod): I.SetSelectedPeriod => ({
  type: LeaderboardEnum.SetSelectedPeriod,
  data: { period },
});

export const cleanLeaderboardAlerts = (): I.CleanLeaderboardAlerts => ({
  type: LeaderboardEnum.CleanLeaderboardAlerts,
});

