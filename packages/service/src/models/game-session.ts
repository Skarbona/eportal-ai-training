import mongoose, { Document, Schema, Model } from 'mongoose';

export interface GameSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  level: 'level1' | 'level2' | 'level3';
  points: {
    man: number;
    woman: number;
    total: number;
  };
  tasksCompleted: number;
  categories: mongoose.Types.ObjectId[];
  averageTimePerTask?: number; // in seconds
  isCompleted: boolean;
  // Additional metadata for analytics
  config?: {
    names?: { he: string; she: string };
    place?: string;
  };
}

export const GameSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, required: true, default: Date.now },
  completedAt: { type: Date },
  duration: { type: Number },
  level: { type: String, enum: ['level1', 'level2', 'level3'], required: true },
  points: {
    man: { type: Number, default: 0 },
    woman: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  tasksCompleted: { type: Number, default: 0 },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  averageTimePerTask: { type: Number },
  isCompleted: { type: Boolean, default: false },
  config: {
    names: {
      he: { type: String },
      she: { type: String },
    },
    place: { type: String },
  },
});

// Indexes for performance
GameSessionSchema.index({ userId: 1, completedAt: -1 });
GameSessionSchema.index({ completedAt: -1 });
GameSessionSchema.index({ isCompleted: 1 });
GameSessionSchema.index({ 'points.total': -1 });

const GameSession: Model<GameSessionDocument> = mongoose.model<GameSessionDocument>(
  'GameSession',
  GameSessionSchema,
);

export default GameSession;

