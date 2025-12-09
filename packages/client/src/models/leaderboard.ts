export interface LeaderboardEntry {
  userId: string;
  username: string;
  email?: string;
  totalPoints: number;
  gamesPlayed: number;
  averageTime?: number;
  rank: number;
  lastPlayed?: string;
  userType?: string;
}

export interface UserRank {
  userId: string;
  username: string;
  rank: number | null;
  totalPoints: number;
  gamesPlayed: number;
  period: string;
}

export enum LeaderboardPeriod {
  ALL = 'all',
  WEEK = 'week',
  MONTH = 'month',
  TODAY = 'today',
}

export interface GameSessionData {
  level: 'level1' | 'level2' | 'level3';
  points: {
    man: number;
    woman: number;
    total: number;
  };
  tasksCompleted: number;
  categories: string[];
  config?: {
    names?: { he: string; she: string };
    place?: string;
  };
}

