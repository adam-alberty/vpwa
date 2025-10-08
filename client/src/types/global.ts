export interface Channel {
  id: string;
  name: string;
  lastMessage: string;
  messages?: Message[];
  isPrivate?: boolean;
}

export interface ChannelInvite {
  name: string;
  channelId: string;
  isPrivate?: boolean;
}

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string | number | Date;
}
