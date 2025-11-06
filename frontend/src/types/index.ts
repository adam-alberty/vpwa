export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  createdAt: string;
}

export interface ChannelInvite {
  id: string;
  channelId: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  mentionedUser: User | null;
  createdAt: string;
  updatedAt: string;
}
