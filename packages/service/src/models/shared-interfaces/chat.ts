export interface MessageInterface {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'system';
  createdAt: Date;
  readBy: string[];
  edited: boolean;
  editedAt?: Date;
  deleted: boolean;
}

export interface ChatRoomInterface {
  id: string;
  name: string;
  type: 'private' | 'group' | 'global';
  participants: string[];
  createdBy: string;
  createdAt: Date;
  lastMessageAt?: Date;
  lastMessage?: string;
}

export interface CreateRoomRequest {
  name: string;
  type: 'private' | 'group' | 'global';
  participants: string[];
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
  type?: 'text' | 'system';
}

