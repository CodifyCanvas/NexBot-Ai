"use server";
import { messages } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function createNewMessage(chatId: string, message: string, sender: string) {
    await db.insert(messages).values({
        message: message,
        sender: sender,
        chatId: chatId,
    });
    return true;
}

export async function fetchMessages(chatId: string) {
    const result = await db.select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);
    return result;
}



