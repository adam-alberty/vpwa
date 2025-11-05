export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  // latestMessage: string;
  newMessageCount?: number;
  messages?: Message[];
  nextMessagePage?: number;

  isPrivate?: boolean;
}

export interface ChannelInvite {
  name: string;
  channelId: string;
  isPrivate?: boolean;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp?: string | number | Date;
}

export interface BasicUser {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'dnd';
}

export interface User extends BasicUser {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
