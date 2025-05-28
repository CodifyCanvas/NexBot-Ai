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
  createdAt: Date; // or string, depending on how it's returned from your DB/ORM
}

export type ChatResult = {
  chatId: string;
  chatTitle: string;
  createdAt: Date | string;
  favorite: boolean;
  message: string | null;
};