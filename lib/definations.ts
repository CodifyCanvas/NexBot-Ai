export interface Chat {
  id: number
  userId: number
  chatId: string
  title: string
  color?: number
  isShareable: boolean
  createdAt: Date // 
}

export interface User {
  id: number;
  profileImg: string | null;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
  verified: boolean;
  createdAt?: Date;
}

export interface UserTable {
  id: number;
  profileImg: string | null;
  name: string;
  email: string;
  admin: boolean;
  verified: boolean;
}

export interface AdminStats {
  totalUsers: number;
  ActiveUsers: number;
  TotalChats: number;
  TotalMessages: number;
};

export type ChatResult = {
  chatId: string;
  chatTitle: string;
  createdAt: Date | string;
  favorite: boolean;
  message: string | null;
};

// Define the contact message data structure
export type ContactTable = {
  id: number;
  name: string;
  email: string;
  message: string;
  respondedAt: Date | null;
  createdAt: Date;
};

export type UserConversationStats = {
  date: string;
  chat: number;
  message: number;
  botResponse: number;
};

export type UserGeneralStatsData = {
  id: number;
  name: string;
  profileImg: string | null;
  email: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  totalMessages: number;
  totalChats: number;
  totalBotResponses: number;
};

export type DailyStat = {
  date: string;   // 'YYYY-MM-DD'
  users: number;
  chats: number;
  messages: number;
};