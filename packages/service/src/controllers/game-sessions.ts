import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import GameSession, { GameSessionDocument } from '../models/game-session';
import User from '../models/user';
import { logControllerError } from '../utils/error-logs';

export const createGameSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.userData;
  const sessionData = req.body;

  try {
    const gameSession = new GameSession({
      userId,
      ...sessionData,
      startedAt: new Date(),
    });

    await gameSession.save();

    res.status(201).json({
      session: gameSession.toObject({ getters: true }),
      message: 'Game session created',
    });
  } catch (e) {
    logControllerError('createGameSession', e);
    return next(new HttpError('Could not create game session: ' + e.message, 500));
  }
};

export const completeGameSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { sessionId } = req.params;
  const { points, tasksCompleted, duration } = req.body;

  try {
    const session = await GameSession.findById(sessionId);

    if (!session) {
      return next(new HttpError('Session not found', 404));
    }

    session.points = points;
    session.tasksCompleted = tasksCompleted;
    session.duration = duration;
    session.completedAt = new Date();
    session.isCompleted = true;

    if (duration && tasksCompleted) {
      session.averageTimePerTask = duration / tasksCompleted;
    }

    await session.save();

    res.json({
      session: session.toObject({ getters: true }),
      message: 'Session completed',
    });
  } catch (e) {
    logControllerError('completeGameSession', e);
    return next(new HttpError('Error: ' + e.message, 500));
  }
};

export const getUserSessions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.params;
  const { limit, skip, sort } = req.query;

  try {
    const sortOption: any = sort ? JSON.parse(sort as string) : { completedAt: -1 };

    const sessions = await GameSession.find({ userId })
      .sort(sortOption)
      .limit(parseInt(limit as string, 10) || 100)
      .skip(parseInt(skip as string, 10) || 0)
      .populate('categories', 'name');

    res.json({
      sessions: sessions.map((s) => s.toObject({ getters: true })),
      userId,
      count: sessions.length,
    });
  } catch (e) {
    logControllerError('getUserSessions', e);
    return next(new HttpError('Error: ' + e.message, 500));
  }
};

export const deleteGameSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { sessionId } = req.params;
  const { userId } = req.userData;

  try {
    const session = await GameSession.findById(sessionId);

    if (!session) {
      return next(new HttpError('Session not found', 404));
    }

    await session.remove();

    res.json({
      message: 'Session deleted',
      sessionId,
      deletedSession: session.toObject({ getters: true }),
    });
  } catch (e) {
    logControllerError('deleteGameSession', e);
    return next(new HttpError('Error deleting session', 500));
  }
};

export const updateGameSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { sessionId } = req.params;
  const updateData = req.body;

  try {
    const session = await GameSession.findByIdAndUpdate(
      sessionId,
      { ...updateData },
      { new: true },
    );

    if (!session) {
      return next(new HttpError('Session not found', 404));
    }

    res.json({
      session: session.toObject({ getters: true }),
      message: 'Session updated',
    });
  } catch (e) {
    logControllerError('updateGameSession', e);
    return next(new HttpError('Error: ' + e.message, 500));
  }
};

export const getSessionStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.params;

  try {
    const stats = await GameSession.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId), isCompleted: true },
      },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalPoints: { $sum: '$points.total' },
          avgPoints: { $avg: '$points.total' },
          avgDuration: { $avg: '$duration' },
          totalTasksCompleted: { $sum: '$tasksCompleted' },
        },
      },
    ]);

    const user = await User.findById(userId);

    res.json({
      userId,
      username: user?.name,
      email: user?.email,
      stats: stats[0] || {
        totalGames: 0,
        totalPoints: 0,
        avgPoints: 0,
        avgDuration: 0,
        totalTasksCompleted: 0,
      },
    });
  } catch (e) {
    logControllerError('getSessionStats', e);
    return next(new HttpError('Error fetching stats: ' + e.message, 500));
  }
};

