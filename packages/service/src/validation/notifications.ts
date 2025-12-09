import { checkSchema } from 'express-validator';

export const getNotifications = checkSchema({
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 1, max: 50 },
      errorMessage: 'Limit must be between 1 and 50',
    },
    toInt: true,
  },
  skip: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 0 },
      errorMessage: 'Skip must be a positive number',
    },
    toInt: true,
  },
  unreadOnly: {
    in: ['query'],
    optional: true,
    isBoolean: {
      errorMessage: 'unreadOnly must be a boolean',
    },
  },
});

export const markAsRead = checkSchema({
  notificationId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid notification ID',
    },
  },
});

export const deleteNotification = checkSchema({
  notificationId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid notification ID',
    },
  },
});

// TODO: Add validation for batch operations
// export const batchDelete = checkSchema({ ... });

