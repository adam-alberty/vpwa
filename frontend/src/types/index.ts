export enum UserStatus {
  ONLINE = 'online',
  DND = 'dnd',
  OFFLINE = 'offline',
}

export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ChannelMemberRole {
  MEMBER = 'member',
  ADMIN = 'admin', // Owner...
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
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
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
}

export interface UserMember extends User {
  role: ChannelMemberRole
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  mentionedUser: User | null;
  createdAt: string;
  updatedAt: string;
}
