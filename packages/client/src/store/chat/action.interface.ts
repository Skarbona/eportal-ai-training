import { ChatEnum } from './enum';
import { Message, ChatRoom } from '../../models/chat';
import { AlertTypes } from '../../models/alerts';

export interface InitFetchRooms {
  type: ChatEnum.InitFetchRooms;
}

export interface SuccessFetchRooms {
  type: ChatEnum.SuccessFetchRooms;
  data: {
    rooms: ChatRoom[];
  };
}

export interface FailFetchRooms {
  type: ChatEnum.FailFetchRooms;
  data: {
    error: Error;
  };
}

export interface InitFetchMessages {
  type: ChatEnum.InitFetchMessages;
}

export interface SuccessFetchMessages {
  type: ChatEnum.SuccessFetchMessages;
  data: {
    roomId: string;
    messages: Message[];
    hasMore: boolean;
  };
}

export interface FailFetchMessages {
  type: ChatEnum.FailFetchMessages;
  data: {
    error: Error;
  };
}

export interface SetActiveRoom {
  type: ChatEnum.SetActiveRoom;
  data: {
    room: ChatRoom | null;
  };
}

export interface AddMessage {
  type: ChatEnum.AddMessage;
  data: {
    message: Message;
  };
}

export interface UpdateMessage {
  type: ChatEnum.UpdateMessage;
  data: {
    message: Message;
  };
}

export interface DeleteMessage {
  type: ChatEnum.DeleteMessage;
  data: {
    messageId: string;
    roomId: string;
  };
}

export interface AddRoom {
  type: ChatEnum.AddRoom;
  data: {
    room: ChatRoom;
  };
}

export interface UpdateUnreadCount {
  type: ChatEnum.UpdateUnreadCount;
  data: {
    roomId: string;
    count: number;
  };
}

export interface ClearUnreadCount {
  type: ChatEnum.ClearUnreadCount;
  data: {
    roomId: string;
  };
}

export interface CleanChatAlerts {
  type: ChatEnum.CleanChatAlerts;
}

export type ChatActions =
  | InitFetchRooms
  | SuccessFetchRooms
  | FailFetchRooms
  | InitFetchMessages
  | SuccessFetchMessages
  | FailFetchMessages
  | SetActiveRoom
  | AddMessage
  | UpdateMessage
  | DeleteMessage
  | AddRoom
  | UpdateUnreadCount
  | ClearUnreadCount
  | CleanChatAlerts;

