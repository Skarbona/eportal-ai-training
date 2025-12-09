import { Message, ChatRoom } from '../../models/chat';
import { AlertTypes } from '../../models/alerts';

export interface ChatStateInterface {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  messages: { [roomId: string]: Message[] };
  loading: boolean;
  error: Error | null;
  alertType: AlertTypes;
  unreadCounts: { [roomId: string]: number };
}

export const chatInitialState: ChatStateInterface = {
  rooms: [],
  activeRoom: null,
  messages: {},
  loading: false,
  error: null,
  alertType: null,
  unreadCounts: {},
};

