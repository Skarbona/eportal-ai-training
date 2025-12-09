import { checkSchema } from 'express-validator';

// TODO: Add validation to routes
export const getGlobalLeaderboard = checkSchema({
  period: {
    isIn: {
      options: [['all', 'week', 'month', 'today']],
      errorMessage: 'Period must be one of: all, week, month, today',
    },
    optional: true,
  },
  limit: {
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'Limit must be between 1 and 100',
    },
    optional: true,
    toInt: true,
  },
  sort: {
    isString: true,
    optional: true,
  },
});

export const getUserRank = checkSchema({
  userId: {
    isMongoId: {
      errorMessage: 'Invalid user ID',
    },
  },
  period: {
    isIn: {
      options: [['all', 'week', 'month']],
      errorMessage: 'Period must be one of: all, week, month',
    },
    optional: true,
  },
});

export const createGameSession = checkSchema({
  level: {
    isIn: {
      options: [['level1', 'level2', 'level3']],
      errorMessage: 'Level must be one of: level1, level2, level3',
    },
  },
  'points.man': {
    isInt: {
      options: { min: 0, max: 10000 },
      errorMessage: 'Man points must be between 0 and 10000',
    },
    optional: true,
  },
  'points.woman': {
    isInt: {
      options: { min: 0, max: 10000 },
      errorMessage: 'Woman points must be between 0 and 10000',
    },
    optional: true,
  },
  'points.total': {
    isInt: {
      options: { min: 0, max: 20000 },
      errorMessage: 'Total points must be between 0 and 20000',
    },
    optional: true,
  },
  tasksCompleted: {
    isInt: {
      options: { min: 0, max: 1000 },
      errorMessage: 'Tasks completed must be between 0 and 1000',
    },
    optional: true,
  },
  duration: {
    isInt: {
      options: { min: 0, max: 36000 }, // max 10 hours
      errorMessage: 'Duration must be between 0 and 36000 seconds',
    },
    optional: true,
  },
});

export const completeGameSession = checkSchema({
  sessionId: {
    isMongoId: {
      errorMessage: 'Invalid session ID',
    },
  },
});

