import { checkSchema } from 'express-validator';

export const createRoom = checkSchema({
  name: {
    in: ['body'],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: 'Room name is required',
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: 'Room name must be between 1 and 100 characters',
    },
  },
  type: {
    in: ['body'],
    isIn: {
      options: [['private', 'group', 'global']],
      errorMessage: 'Type must be one of: private, group, global',
    },
  },
  participants: {
    in: ['body'],
    isArray: {
      options: { min: 1 },
      errorMessage: 'Participants must be a non-empty array',
    },
  },
  'participants.*': {
    isMongoId: {
      errorMessage: 'Each participant must be a valid user ID',
    },
  },
});

export const getRoom = checkSchema({
  roomId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
});

export const addParticipant = checkSchema({
  roomId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
  participantId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'Invalid participant ID',
    },
  },
});

export const leaveRoom = checkSchema({
  roomId: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'Invalid room ID',
    },
  },
});

