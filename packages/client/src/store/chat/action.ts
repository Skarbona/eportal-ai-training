import { ChatEnum } from './enum';
import * as I from './action.interface';
import { Message, ChatRoom } from '../../models/chat';

export const initFetchRooms = (): I.InitFetchRooms => ({
  type: ChatEnum.InitFetchRooms,
});

export const successFetchRooms = (rooms: ChatRoom[]): I.SuccessFetchRooms => ({
  type: ChatEnum.SuccessFetchRooms,
  data: { rooms },
});

export const failFetchRooms = (error: Error): I.FailFetchRooms => ({
  type: ChatEnum.FailFetchRooms,
  data: { error },
});

export const initFetchMessages = (): I.InitFetchMessages => ({
  type: ChatEnum.InitFetchMessages,
});

export const successFetchMessages = (
  roomId: string,
  messages: Message[],
  hasMore: boolean,
): I.SuccessFetchMessages => ({
  type: ChatEnum.SuccessFetchMessages,
  data: { roomId, messages, hasMore },
});

export const failFetchMessages = (error: Error): I.FailFetchMessages => ({
  type: ChatEnum.FailFetchMessages,
  data: { error },
});

export const setActiveRoom = (room: ChatRoom | null): I.SetActiveRoom => ({
  type: ChatEnum.SetActiveRoom,
  data: { room },
});

export const addMessage = (message: Message): I.AddMessage => ({
  type: ChatEnum.AddMessage,
  data: { message },
});

export const updateMessage = (message: Message): I.UpdateMessage => ({
  type: ChatEnum.UpdateMessage,
  data: { message },
});

export const deleteMessage = (messageId: string, roomId: string): I.DeleteMessage => ({
  type: ChatEnum.DeleteMessage,
  data: { messageId, roomId },
});

export const addRoom = (room: ChatRoom): I.AddRoom => ({
  type: ChatEnum.AddRoom,
  data: { room },
});

export const updateUnreadCount = (roomId: string, count: number): I.UpdateUnreadCount => ({
  type: ChatEnum.UpdateUnreadCount,
  data: { roomId, count },
});

export const clearUnreadCount = (roomId: string): I.ClearUnreadCount => ({
  type: ChatEnum.ClearUnreadCount,
  data: { roomId },
});

export const cleanChatAlerts = (): I.CleanChatAlerts => ({
  type: ChatEnum.CleanChatAlerts,
});

