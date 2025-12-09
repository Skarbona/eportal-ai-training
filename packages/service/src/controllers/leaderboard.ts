import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import GameSession from '../models/game-session';
import User from '../models/user';
import { logControllerError } from '../utils/error-logs';

export const getGlobalLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { period = 'all', limit = 100, sort } = req.query;

  try {
    let dateFilter = {};

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { completedAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { completedAt: { $gte: monthAgo } };
    } else if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { completedAt: { $gte: today } };
    }

    const limitNumber = parseInt(limit as string, 10);
    const sortField = sort || '-totalPoints';

    const leaderboard = await GameSession.aggregate([
      {
        $match: {
          isCompleted: true,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points.total' },
          gamesPlayed: { $sum: 1 },
          averageTime: { $avg: '$averageTimePerTask' },
          lastPlayed: { $max: '$completedAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$_id',
          username: '$user.name',
          email: '$user.email',
          totalPoints: 1,
          gamesPlayed: 1,
          averageTime: 1,
          lastPlayed: 1,
          userType: '$user.type',
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: limitNumber },
    ]);

    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.json({
      leaderboard: leaderboardWithRank,
      period,
      total: leaderboardWithRank.length,
      query: { dateFilter, limit: limitNumber, sort: sortField },
    });
  } catch (e) {
    logControllerError('getGlobalLeaderboard', e);
    return next(new HttpError('Error fetching leaderboard: ' + e.message, 500));
  }
};

export const getCategoryLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { categoryId } = req.params;
  const { limit = 50 } = req.query;

  try {
    const leaderboard = await GameSession.aggregate([
      {
        $match: {
          isCompleted: true,
          categories: mongoose.Types.ObjectId(categoryId as string),
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points.total' },
          gamesPlayed: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          username: '$user.name',
          email: '$user.email',
          totalPoints: 1,
          gamesPlayed: 1,
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit as string, 10) },
    ]);

    res.json({ leaderboard, categoryId });
  } catch (e) {
    logControllerError('getCategoryLeaderboard', e);
    return next(new HttpError('Error: ' + e.message, 500));
  }
};

export const getUserRank = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.params;
  const { period = 'all' } = req.query;

  try {
    let dateFilter = {};
    if (period !== 'all') {
      const date = new Date();
      if (period === 'week') date.setDate(date.getDate() - 7);
      if (period === 'month') date.setMonth(date.getMonth() - 1);
      dateFilter = { completedAt: { $gte: date } };
    }

    const userStats = await GameSession.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          isCompleted: true,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$points.total' },
          gamesPlayed: { $sum: 1 },
        },
      },
    ]);

    if (!userStats.length) {
      return res.json({
        userId,
        rank: null,
        totalPoints: 0,
        message: 'User has no completed games',
      });
    }

    const userPoints = userStats[0].totalPoints;

    const usersAbove = await GameSession.aggregate([
      {
        $match: {
          isCompleted: true,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points.total' },
        },
      },
      {
        $match: {
          totalPoints: { $gt: userPoints },
        },
      },
      {
        $count: 'count',
      },
    ]);

    const rank = (usersAbove[0]?.count || 0) + 1;
    const user = await User.findById(userId);

    res.json({
      userId,
      username: user?.name,
      email: user?.email,
      rank,
      totalPoints: userPoints,
      gamesPlayed: userStats[0].gamesPlayed,
      period,
      gameDefaults: user?.gameDefaults,
    });
  } catch (e) {
    logControllerError('getUserRank', e);
    return next(new HttpError('Error: ' + e.message, 500));
  }
};

export const resetLeaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.userData;

  if (!userId) {
    return next(new HttpError('Unauthorized', 401));
  }

  try {
    const result = await GameSession.deleteMany({});

    res.json({
      message: 'Leaderboard reset successfully',
      deletedCount: result.deletedCount,
      resetBy: userId,
      timestamp: new Date(),
    });
  } catch (e) {
    logControllerError('resetLeaderboard', e);
    return next(new HttpError('Error resetting leaderboard', 500));
  }
};

