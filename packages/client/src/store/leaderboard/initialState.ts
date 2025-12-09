import { LeaderboardEntry, UserRank, LeaderboardPeriod } from '../../models/leaderboard';
import { AlertTypes } from '../../models/alerts';

export interface LeaderboardStateInterface {
  globalLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  monthlyLeaderboard: LeaderboardEntry[];
  userRank: UserRank | null;
  loading: boolean;
  error: Error | null;
  alertType: AlertTypes;
  selectedPeriod: LeaderboardPeriod;
  lastUpdated: Date | null;
}

export const leaderboardInitialState: LeaderboardStateInterface = {
  globalLeaderboard: [],
  weeklyLeaderboard: [],
  monthlyLeaderboard: [],
  userRank: null,
  loading: false,
  error: null,
  alertType: null,
  selectedPeriod: LeaderboardPeriod.ALL,
  lastUpdated: null,
};

