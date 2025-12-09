import { ChatActions } from './action.interface';
import { ChatEnum } from './enum';
import { chatInitialState } from './initialState';
import { ChatStateInterface } from './initialState.interface';
import { AlertTypes } from '../../models/alerts';

const chatReducer = (state = chatInitialState, action: ChatActions): ChatStateInterface => {
  switch (action.type) {
    case ChatEnum.InitFetchRooms:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ChatEnum.SuccessFetchRooms: {
      const { rooms } = action.data;
      return {
        ...state,
        loading: false,
        rooms,
      };
    }

    case ChatEnum.FailFetchRooms: {
      const { error } = action.data;
      return {
        ...state,
        loading: false,
        error,
        alertType: AlertTypes.ServerError,
      };
    }

    case ChatEnum.InitFetchMessages:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ChatEnum.SuccessFetchMessages: {
      const { roomId, messages } = action.data;
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [roomId]: messages,
        },
      };
    }

    case ChatEnum.FailFetchMessages: {
      const { error } = action.data;
      return {
        ...state,
        loading: false,
        error,
        alertType: AlertTypes.ServerError,
      };
    }

    case ChatEnum.SetActiveRoom: {
      const { room } = action.data;
      return {
        ...state,
        activeRoom: room,
      };
    }

    case ChatEnum.AddMessage: {
      const { message } = action.data;
      const roomMessages = state.messages[message.roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
      };
    }

    case ChatEnum.UpdateMessage: {
      const { message } = action.data;
      const roomMessages = state.messages[message.roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.roomId]: roomMessages.map((m) => (m.id === message.id ? message : m)),
        },
      };
    }

    case ChatEnum.DeleteMessage: {
      const { messageId, roomId } = action.data;
      const roomMessages = state.messages[roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [roomId]: roomMessages.filter((m) => m.id !== messageId),
        },
      };
    }

    case ChatEnum.AddRoom: {
      const { room } = action.data;
      return {
        ...state,
        rooms: [room, ...state.rooms],
      };
    }

    case ChatEnum.UpdateUnreadCount: {
      const { roomId, count } = action.data;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [roomId]: count,
        },
      };
    }

    case ChatEnum.ClearUnreadCount: {
      const { roomId } = action.data;
      const { [roomId]: _, ...restCounts } = state.unreadCounts;
      return {
        ...state,
        unreadCounts: restCounts,
      };
    }

    case ChatEnum.CleanChatAlerts:
      return {
        ...state,
        error: null,
        alertType: null,
      };

    default:
      return state;
  }
};

export default chatReducer;

