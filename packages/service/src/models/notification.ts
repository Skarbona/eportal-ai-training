import mongoose, { Document, Schema, Model } from 'mongoose';

// TODO: Add more notification types as we expand features
export enum NotificationType {
  GameInvite = 'game_invite',
  NewMessage = 'new_message',
  LeaderboardRank = 'leaderboard_rank',
  Achievement = 'achievement',
  // TODO: Add friend_request when we implement friends feature
  // TODO: Add comment_reply when we add comments
}

export interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: any; // Additional data specific to notification type
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  // TODO: Add actionUrl field for clickable notifications
  // TODO: Add expiresAt for temporary notifications
}

export const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 500 },
  data: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  readAt: { type: Date },
});

// Indexes for performance
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

const Notification: Model<NotificationDocument> = mongoose.model<NotificationDocument>(
  'Notification',
  NotificationSchema,
);

export default Notification;

