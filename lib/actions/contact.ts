import { contactUs } from "@/drizzle/schema";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";

export async function saveContactMessage(name: string, email: string, message: string) {
    const result = await db.insert(contactUs).values({
        name: name,
        email: email,
        message: message,
    });
    console.log("saveContactMessage Result Variable: ", result)
    return !!(result && ('insertId' in result ? result.insertId : true));
}

export async function fetchContactMessages() {
    const chat = await db
      .select()
      .from(contactUs)
      .orderBy(desc(contactUs.createdAt));

    return chat;
}


export async function fetchContactMessageById(messageId: number) {
  // Fetch the contact message with the given ID from the database
  const result = await db
    .select()
    .from(contactUs)
    .where(eq(contactUs.id, messageId))
    .limit(1);

  // Return the first result if found, otherwise null
  return result.length > 0 ? result[0] : null;
}


export async function DeleteContactMessage(id: number) {
  // Step 1: Delete the message
  return await db.delete(contactUs).where(eq(contactUs.id, id));
}

export async function updateRespondedStatus(messageId: number): Promise<{ updated: boolean; timestamp?: Date }> {
  const respondedAt = new Date();

  const result = await db
    .update(contactUs)
    .set({ respondedAt })
    .where(eq(contactUs.id, messageId));

  // MySQL returns `changedRows` in the first array element
  const updated = Array.isArray(result) && result[0]?.changedRows > 0;

  return {
    updated,
    ...(updated && { timestamp: respondedAt }),
  };
}
