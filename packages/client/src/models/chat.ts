export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'system';
  createdAt: string;
  readBy: string[];
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'global';
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  createdBy: string;
  createdAt: string;
  lastMessageAt?: string;
  lastMessage?: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
}

export interface CreateRoomPayload {
  name: string;
  type: 'private' | 'group' | 'global';
  participants: string[];
}

