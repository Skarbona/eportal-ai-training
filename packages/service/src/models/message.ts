import mongoose, { Document, Schema, Model } from 'mongoose';

export enum MessageType {
  Text = 'text',
  System = 'system',
}

export enum RoomType {
  Private = 'private',
  Group = 'group',
  Global = 'global',
}

export interface MessageDocument extends Document {
  roomId: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  readBy: mongoose.Types.ObjectId[];
  edited: boolean;
  editedAt?: Date;
  deleted: boolean;
}

export const MessageSchema = new Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: Object.values(MessageType), default: MessageType.Text },
  createdAt: { type: Date, default: Date.now, index: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  deleted: { type: Boolean, default: false },
});

// Indexes for performance
MessageSchema.index({ roomId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });

const Message: Model<MessageDocument> = mongoose.model<MessageDocument>('Message', MessageSchema);

export default Message;

