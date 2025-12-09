export interface NotificationInterface {
  id: string;
  userId: string;
  type: 'game_invite' | 'new_message' | 'leaderboard_rank' | 'achievement';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface CreateNotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

