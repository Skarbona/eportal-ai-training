import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ChatRoomDocument extends Document {
  name: string;
  type: 'private' | 'group' | 'global';
  participants: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  lastMessageAt?: Date;
  lastMessage?: string;
}

export const ChatRoomSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['private', 'group', 'global'], required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date },
  lastMessage: { type: String, maxlength: 200 },
});

// Indexes
ChatRoomSchema.index({ participants: 1 });
ChatRoomSchema.index({ type: 1, lastMessageAt: -1 });

// Helper method to check if user is participant
ChatRoomSchema.methods.isParticipant = function (userId: string): boolean {
  return this.participants.some((p) => p.toString() === userId);
};

const ChatRoom: Model<ChatRoomDocument> = mongoose.model<ChatRoomDocument>(
  'ChatRoom',
  ChatRoomSchema,
);

export default ChatRoom;

