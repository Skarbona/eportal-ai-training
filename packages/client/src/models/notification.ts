// TODO: Expand notification types as backend adds more
export type NotificationType =
  | 'game_invite'
  | 'new_message'
  | 'leaderboard_rank'
  | 'achievement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

// TODO: Add notification preferences interface
// export interface NotificationPreferences {
//   email: boolean;
//   push: boolean;
//   gameInvites: boolean;
//   messages: boolean;
//   leaderboard: boolean;
// }

