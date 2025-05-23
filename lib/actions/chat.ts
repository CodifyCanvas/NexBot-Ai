"use server";
import { chats, favoriteChats, messages } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, desc, eq } from 'drizzle-orm';

export async function createNewChat(userId: number, chatId: string, title: string) {
  await db.insert(chats).values({
    userId: userId,
    chatId: chatId,
    title: title,
  });
  return true;
}

export async function fetchChats(userId: string) {
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
      .where(eq(favoriteChats.userId, userId))
      .where(eq(favoriteChats.chatId, chatId));

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
      .where(eq(favoriteChats.userId, userId))
      .where(eq(favoriteChats.chatId, chatId));

    if (existingFavorite.length > 0) {
      // If it exists, remove it
      await db.delete(favoriteChats)
        .where(eq(favoriteChats.userId, userId))
        .where(eq(favoriteChats.chatId, chatId));
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

// Toggle chat share status (private ↔ shareable)
export async function toggleShare( userId: number, chatId: string, isShareable: boolean) {
  const result = await db
    .update(chats)
    .set({ isShareable: isShareable })
    .where(eq(chats.userId, userId))
    .where(eq(chats.chatId, chatId));

  return result;
}




