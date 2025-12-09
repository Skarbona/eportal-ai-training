import { checkSchema } from 'express-validator';

export const getMessages = checkSchema({
  roomId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
  limit: {
    in: ['query'],
    optional: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: 'Limit must be between 1 and 100',
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
});

export const sendMessage = checkSchema({
  roomId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
  content: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Content cannot be empty',
    },
    isLength: {
      options: { min: 1, max: 2000 },
      errorMessage: 'Content must be between 1 and 2000 characters',
    },
  },
});

export const editMessage = checkSchema({
  messageId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid message ID',
    },
  },
  content: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Content cannot be empty',
    },
    isLength: {
      options: { min: 1, max: 2000 },
      errorMessage: 'Content must be between 1 and 2000 characters',
    },
  },
});

export const deleteMessage = checkSchema({
  messageId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid message ID',
    },
  },
});

export const markAsRead = checkSchema({
  roomId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
});

