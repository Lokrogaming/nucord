export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bannerColor?: string;
  bio?: string;
  status: UserStatus;
  customStatus?: string;
  isBot?: boolean;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Permission[];
  position: number;
  hoist: boolean; // Display role members separately
  mentionable: boolean;
}

export type Permission = 
  | 'ADMINISTRATOR'
  | 'MANAGE_SERVER'
  | 'MANAGE_CHANNELS'
  | 'MANAGE_ROLES'
  | 'MANAGE_MESSAGES'
  | 'SEND_MESSAGES'
  | 'READ_MESSAGES'
  | 'ATTACH_FILES'
  | 'CREATE_INSTANT_INVITE'
  | 'VIEW_CHANNEL';

export interface Server {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  roles: Role[];
  categories: Category[];
  members: Member[];
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

export type ChannelType = 'text' | 'voice' | 'announcement';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  topic?: string;
  parentId?: string; // Category ID
  permissionOverwrites?: PermissionOverwrite[];
}

export interface PermissionOverwrite {
  id: string; // User or Role ID
  type: 'member' | 'role';
  allow: Permission[];
  deny: Permission[];
}

export interface Member {
  userId: string;
  serverId: string;
  nickname?: string;
  roleIds: string[];
  joinedAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string;
  editedAt?: string;
  isPinned?: boolean;
  attachments?: Attachment[];
  reactions?: Reaction[];
  replyToId?: string;
  threadId?: string;
}

export interface DMGroup {
  id: string;
  name?: string;
  memberIds: string[];
  lastMessageId?: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Thread {
  id: string;
  parentId: string; // Message ID
  channelId: string;
  name: string;
  messageCount: number;
  memberCount: number;
  archiveTimestamp: string;
}

export interface Presence {
  userId: string;
  status: UserStatus;
  activity?: {
    type: 'playing' | 'streaming' | 'listening' | 'watching' | 'custom';
    name: string;
    state?: string;
    details?: string;
  };
}
