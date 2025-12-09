import { LeaderboardEnum } from './enum';
import { LeaderboardEntry, UserRank, LeaderboardPeriod } from '../../models/leaderboard';
import { AlertTypes } from '../../models/alerts';

export interface InitFetchLeaderboard {
  type: LeaderboardEnum.InitFetchLeaderboard;
}

export interface SuccessFetchLeaderboard {
  type: LeaderboardEnum.SuccessFetchLeaderboard;
  data: {
    leaderboard: LeaderboardEntry[];
    period: LeaderboardPeriod;
  };
}

export interface FailFetchLeaderboard {
  type: LeaderboardEnum.FailFetchLeaderboard;
  data: {
    error: Error;
  };
}

export interface InitFetchUserRank {
  type: LeaderboardEnum.InitFetchUserRank;
}

export interface SuccessFetchUserRank {
  type: LeaderboardEnum.SuccessFetchUserRank;
  data: {
    userRank: UserRank;
  };
}

export interface FailFetchUserRank {
  type: LeaderboardEnum.FailFetchUserRank;
  data: {
    error: Error;
  };
}

export interface SetSelectedPeriod {
  type: LeaderboardEnum.SetSelectedPeriod;
  data: {
    period: LeaderboardPeriod;
  };
}

export interface CleanLeaderboardAlerts {
  type: LeaderboardEnum.CleanLeaderboardAlerts;
}

export type LeaderboardActions =
  | InitFetchLeaderboard
  | SuccessFetchLeaderboard
  | FailFetchLeaderboard
  | InitFetchUserRank
  | SuccessFetchUserRank
  | FailFetchUserRank
  | SetSelectedPeriod
  | CleanLeaderboardAlerts;

