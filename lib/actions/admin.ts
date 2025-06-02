import { chats, messages, users } from "@/drizzle/schema";
import { db } from "../db";
import { count, eq } from "drizzle-orm";

export async function checkAdmin(userId: number): Promise<boolean> {
  const [user] = await db
    .select({
      admin: users.admin,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.admin === true;
}

export async function getAdminStats() {
  // Total Users
  const [{ totalUsers }] = await db
    .select({ totalUsers: count() })
    .from(users);

  // Active Users
  const [{ activeUsers }] = await db
    .select({ activeUsers: count() })
    .from(users)
    .where(eq(users.verified, true));

  // Total Chats
  const [{ totalChats }] = await db
    .select({ totalChats: count() })
    .from(chats);

  // Total Messages
  const [{ totalMessages }] = await db
    .select({ totalMessages: count() })
    .from(messages);

  return {
    totalUsers,
    ActiveUsers: activeUsers,
    TotalChats: totalChats,
    TotalMessages: totalMessages,
  };
}