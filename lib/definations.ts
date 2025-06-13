export interface Chat {
  id: number
  userId: number
  chatId: string
  title: string
  color?: number
  isShareable: boolean
  createdAt: string // or `Date` if you parse it
}

export interface User {
  id: number;
  profileImg: string;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
  verified: boolean;
  createdAt?: Date; // or string, depending on how it's returned from your DB/ORM
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