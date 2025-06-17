// User Table
import { sql } from 'drizzle-orm'
import { mysqlTable, int, text, varchar, boolean, datetime } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  profileImg: text('profile_img'),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  admin: boolean('admin').notNull().default(false), // ✅ boolean type with default
  verified: boolean('verified').notNull().default(false), // ✅ boolean type with default
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Chats Table
export const chats = mysqlTable('chats', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  chatId: varchar('chat_id', { length: 255 }).notNull().unique(), // uuid from nodjs api
  title: varchar('title', { length: 255 }).notNull(), // New title field
  isShareable: boolean('is_shareable').notNull().default(false),
  color: int('color').notNull().default(1),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const favoriteChats = mysqlTable('favoriteChats', {
  id: int('id').primaryKey().autoincrement(), // Optional if you want a unique ID
  userId: int('user_id').notNull().references(() => users.id),
  chatId: varchar('chat_id', { length: 255 }).notNull().unique(), // ✅ one chat, one favorite
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Messages Table
export const messages = mysqlTable('messages', {
  id: int('id').primaryKey().autoincrement(),
  chatId: varchar('chat_id', { length: 255 }).notNull().references(() => chats.chatId), // ❗ FIX: chatId should be varchar to match chatId in `chats` table
  message: varchar('message', { length: 10000 }).notNull(),
  sender: varchar('sender', { length: 255 }).notNull(), // or enum later (user/bot)
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Contact us Table
export const contactUs = mysqlTable('contact_us', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  respondedAt: datetime('responded_at'), // if NULL = not responded
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});


