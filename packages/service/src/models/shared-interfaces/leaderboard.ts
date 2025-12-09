export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  gamesPlayed: number;
  gamesCompleted: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  averageTime?: number;
  rank: number;
  lastPlayed?: Date;
}

export interface UserStats {
  totalPoints: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate?: Date;
  achievements: string[];
}

export enum LeaderboardPeriod {
  ALL = 'all',
  WEEK = 'week',
  MONTH = 'month',
  TODAY = 'today',
}

