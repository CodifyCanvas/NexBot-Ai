"use server";
import { chats, favoriteChats, messages } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { ChatResult } from "../definations";

export async function createNewChat(userId: number, chatId: string, title: string, color: number) {
  await db.insert(chats).values({
    userId: userId,
    chatId: chatId,
    title: title,
    color: color,
  });
  return true;
}

export async function fetchChats(userId: number) {
  const result = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.createdAt)); // Sort by createdAt descending (newest first)

  return result;
}


export async function fetchFavoriteChats(userId: number) {
  const result = await db
    .select()
    .from(favoriteChats)
    .leftJoin(chats, eq(favoriteChats.chatId, chats.chatId))
    .where(eq(favoriteChats.userId, userId))
    .orderBy(favoriteChats.createdAt)

  // Map result to return full chat info from `chats` table
  return result
    .filter(row => row.chats !== null) // optional: filter out any unmatched joins
    .map(row => row.chats) // returns the full chat object
}


export async function fetchChat(chatId: string) {
  const chat = await db
    .select()
    .from(chats)
    .where(eq(chats.chatId, chatId))
    .limit(1);

  return chat;
}


// Function to add or remove a chat from the favorites
export async function favoriteChat(userId: number, chatId: string, value: boolean) {
  if (value) {
    // Check if the chat is already in favorites
    const existingFavorite = await db.select()
      .from(favoriteChats)
      .where(and(
        eq(favoriteChats.userId, userId),
        eq(favoriteChats.chatId, chatId)
      ));

    if (existingFavorite.length === 0) {
      // If not in favorites, add it
      await db.insert(favoriteChats).values({
        userId: userId,
        chatId: chatId,
      });
      return { success: true, message: 'Chat added to favorites!' };
    } else {
      return { success: false, message: 'Already in favorites!' };
    }
  } else {
    // Check if the chat exists in favorites
    const existingFavorite = await db.select()
      .from(favoriteChats)
      .where(and(
        eq(favoriteChats.userId, userId),
        eq(favoriteChats.chatId, chatId)
      ));

    if (existingFavorite.length > 0) {
      // If it exists, remove it
      await db.delete(favoriteChats)
        .where(and(
          eq(favoriteChats.userId, userId),
          eq(favoriteChats.chatId, chatId)
        ));
      return { success: true, message: "Chat removed from favorites!" };
    } else {
      return { success: false, message: 'Oops! This chat is not in your favorites yet.' };
    }
  }
}


// Function to Delete Chat
export async function DeleteChat(userId: number, chatId: string) {
  // Step 1: Check if the chat exists for the user
  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.chatId, chatId), eq(chats.userId, userId)),
  });

  if (!chat) {
    throw new Error('Chat not found or unauthorized access.');
  }

  // Step 2: Check if the chat is in the favorites and remove it if it exists
  const favoriteChat = await db.query.favoriteChats.findFirst({
    where: and(eq(favoriteChats.chatId, chatId), eq(favoriteChats.userId, userId)),
  });

  if (favoriteChat) {
    await db.delete(favoriteChats).where(eq(favoriteChats.id, favoriteChat.id));
  }

  // Step 3: Delete all messages related to this chat
  await db.delete(messages).where(eq(messages.chatId, chatId));

  // Step 4: Delete the chat itself
  await db.delete(chats).where(eq(chats.chatId, chatId));
}

// Function to Delete All Chats for a Given User
export async function deleteAllChats(userId: number) {
  // Step 1: Delete all favorite chats for the user
  await db.delete(favoriteChats).where(eq(favoriteChats.userId, userId));

  // Step 2: Get all chat records for the user
  const userChats = await db
    .select({ chatId: chats.chatId })
    .from(chats)
    .where(eq(chats.userId, userId));

  if (userChats.length === 0) return;

  const chatIds = userChats.map((chat) => chat.chatId);

  // Step 3: Delete all messages related to these chatIds
  await db.delete(messages).where(inArray(messages.chatId, chatIds));

  // Step 4: Delete the chats themselves
  await db.delete(chats).where(inArray(chats.chatId, chatIds));
}

// Toggle chat share status (private ↔ shareable)
export async function toggleShare(userId: number, chatId: string, isShareable: boolean) {
  const [result] = await db
    .update(chats)
    .set({ isShareable })
    .where(
      and(eq(chats.userId, userId), eq(chats.chatId, chatId))
    );

  return result.affectedRows > 0;
}

export async function getUserChatsSearch(userId: number, query: string): Promise<ChatResult[]> {
  const results = await db
    .select({
      chatId: chats.chatId,
      chatTitle: chats.title,
      createdAt: chats.createdAt,
      favorite: sql<boolean>`IF(${favoriteChats.chatId} IS NOT NULL, true, false)`.as('favorite'),
      message: sql<string | null>`(
  SELECT m.message FROM ${messages} m
  WHERE m.chat_id = ${chats.chatId}
  ORDER BY m.created_at DESC
  LIMIT 1
)`.as('message'),
    })
    .from(chats)
    .leftJoin(
      favoriteChats,
      and(
        eq(favoriteChats.chatId, chats.chatId),
        eq(favoriteChats.userId, userId)
      )
    )
    .where(
      and(
        eq(chats.userId, userId),
        or(
          sql`LOWER(${chats.title}) LIKE ${`%${query.toLowerCase()}%`}`,
          sql`EXISTS (
            SELECT 1 FROM ${messages}
            WHERE ${messages.chatId} = ${chats.chatId}
            AND LOWER(${messages.message}) LIKE ${`%${query.toLowerCase()}%`}
          )`
        )
      )
    )
    .orderBy(desc(chats.createdAt));

  return results;
}



