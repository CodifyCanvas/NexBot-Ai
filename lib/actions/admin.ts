import { chats, favoriteChats, messages, users } from "@/drizzle/schema";
import { db } from "../db";
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { addDays, differenceInDays, eachDayOfInterval, format, subDays } from "date-fns";

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

type DailyStat = {
  date: string;   // 'YYYY-MM-DD'
  users: number;
  chats: number;
  messages: number;
};

export async function getDailyStats(duration: number): Promise<DailyStat[]> {
  // Helper to build date filter condition or null
  const dateCondition = duration > 0 
    ? sql`WHERE ${users.createdAt} >= DATE_SUB(CURDATE(), INTERVAL ${duration} DAY)`
    : null;

  // Note: Drizzle doesn't support dynamic WHERE in this style, so we manually write queries here.

  // Users query
  const userQuery = duration > 0
    ? db
        .select({
          date: sql<string>`DATE(${users.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(users)
        .where(sql`${users.createdAt} >= DATE_SUB(CURDATE(), INTERVAL ${duration} DAY)`)
        .groupBy(sql`DATE(${users.createdAt})`)
    : db
        .select({
          date: sql<string>`DATE(${users.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(users)
        .groupBy(sql`DATE(${users.createdAt})`);

  // Chats query
  const chatQuery = duration > 0
    ? db
        .select({
          date: sql<string>`DATE(${chats.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(chats)
        .where(sql`${chats.createdAt} >= DATE_SUB(CURDATE(), INTERVAL ${duration} DAY)`)
        .groupBy(sql`DATE(${chats.createdAt})`)
    : db
        .select({
          date: sql<string>`DATE(${chats.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(chats)
        .groupBy(sql`DATE(${chats.createdAt})`);

  // Messages query
  const messageQuery = duration > 0
    ? db
        .select({
          date: sql<string>`DATE(${messages.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(messages)
        .where(sql`${messages.createdAt} >= DATE_SUB(CURDATE(), INTERVAL ${duration} DAY)`)
        .groupBy(sql`DATE(${messages.createdAt})`)
    : db
        .select({
          date: sql<string>`DATE(${messages.createdAt})`.as('date'),
          count: sql<number>`COUNT(*)`.as('count'),
        })
        .from(messages)
        .groupBy(sql`DATE(${messages.createdAt})`);

  const [userStats, chatStats, messageStats] = await Promise.all([
    userQuery,
    chatQuery,
    messageQuery,
  ]);

  // Combine unique dates
  const allDates = Array.from(
    new Set([
      ...userStats.map((u) => u.date),
      ...chatStats.map((c) => c.date),
      ...messageStats.map((m) => m.date),
    ])
  ).sort();

  // Map counts per date (default 0)
  return allDates.map((date) => ({
    date,
    users: userStats.find((u) => u.date === date)?.count ?? 0,
    chats: chatStats.find((c) => c.date === date)?.count ?? 0,
    messages: messageStats.find((m) => m.date === date)?.count ?? 0,
  }));
}

type getUserConversationStats = {
  date: string;
  chat: number;
  message: number;
  botResponse: number;
};

type UserGeneralStatsData = {
  id: number;
  name: string;
  profileImg: string;
  email: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  totalMessages: number;
  totalChats: number;
  totalBotResponses: number;
};

export async function getUserGeneralStats(userId: number): Promise<UserGeneralStatsData> {
  // 1. Fetch user details
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) throw new Error('User not found');

  const { id, name, profileImg, email, admin, verified, createdAt } = user[0];

  // 2. Fetch total chats count
  const totalChats = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(chats)
    .where(eq(chats.userId, userId))
    .then(res => res[0]?.count ?? 0);

  // 3. Fetch user chats to extract chatIds
  const userChats = await db
    .select({ chatId: chats.chatId })
    .from(chats)
    .where(eq(chats.userId, userId));

  const chatIds = userChats.map(c => c.chatId);

  let totalMessages = 0;
  let totalBotResponses = 0;

  // Only query messages if the user has chats
  if (chatIds.length > 0) {
    const userMsg = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(messages)
      .where(and(
        eq(messages.sender, 'user'),
        sql`${messages.chatId} IN (${sql.join(chatIds.map(id => sql`${id}`), sql`,`)})`
      ));
    totalMessages = userMsg[0]?.count ?? 0;

    const botMsg = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(messages)
      .where(and(
        eq(messages.sender, 'bot'),
        sql`${messages.chatId} IN (${sql.join(chatIds.map(id => sql`${id}`), sql`,`)})`
      ));
    totalBotResponses = botMsg[0]?.count ?? 0;
  }

  return {
    id,
    name,
    profileImg,
    email,
    admin,
    verified,
    createdAt: createdAt.toISOString(),
    totalChats,
    totalMessages,
    totalBotResponses,
  };
}

export async function getUserConversationStats(
  userId: number,
  duration: number
): Promise<getUserConversationStats[] | null> {
  if (duration < 0) throw new Error("Duration must be 0 or greater");

  const useDateFilter = duration > 0;
  const dateFilter = sql`DATE_SUB(CURDATE(), INTERVAL ${duration} DAY)`;

  // Define dynamic filters
  const chatFilter = useDateFilter
    ? sql`${chats.userId} = ${userId} AND ${chats.createdAt} >= ${dateFilter}`
    : sql`${chats.userId} = ${userId}`;

  const userMessageFilter = useDateFilter
    ? sql`${messages.sender} = 'user' AND ${messages.createdAt} >= ${dateFilter} AND ${messages.chatId} IN (SELECT ${chats.chatId} FROM ${chats} WHERE ${chats.userId} = ${userId})`
    : sql`${messages.sender} = 'user' AND ${messages.chatId} IN (SELECT ${chats.chatId} FROM ${chats} WHERE ${chats.userId} = ${userId})`;

  const botMessageFilter = useDateFilter
    ? sql`${messages.sender} = 'bot' AND ${messages.createdAt} >= ${dateFilter} AND ${messages.chatId} IN (SELECT ${chats.chatId} FROM ${chats} WHERE ${chats.userId} = ${userId})`
    : sql`${messages.sender} = 'bot' AND ${messages.chatId} IN (SELECT ${chats.chatId} FROM ${chats} WHERE ${chats.userId} = ${userId})`;

  // Run all queries in parallel
  const [chatStats, userMsgStats, botMsgStats] = await Promise.all([
    db
      .select({
        date: sql<string>`DATE(${chats.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(chats)
      .where(chatFilter)
      .groupBy(sql`DATE(${chats.createdAt})`),

    db
      .select({
        date: sql<string>`DATE(${messages.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(messages)
      .where(userMessageFilter)
      .groupBy(sql`DATE(${messages.createdAt})`),

    db
      .select({
        date: sql<string>`DATE(${messages.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(messages)
      .where(botMessageFilter)
      .groupBy(sql`DATE(${messages.createdAt})`),
  ]);

  // Merge all distinct dates
  const allDates = Array.from(
    new Set([
      ...chatStats.map((r) => r.date),
      ...userMsgStats.map((r) => r.date),
      ...botMsgStats.map((r) => r.date),
    ])
  ).sort();

  return allDates.map((date) => ({
    date,
    chat: chatStats.find((r) => r.date === date)?.count ?? 0,
    message: userMsgStats.find((r) => r.date === date)?.count ?? 0,
    botResponse: botMsgStats.find((r) => r.date === date)?.count ?? 0,
  }));
}

export async function fetchAllUsers() {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      profileImg: users.profileImg,
      createdAt: users.createdAt,
      email: users.email,
      admin: users.admin,
      verified: users.verified,
    })
    .from(users)
    .orderBy(users.createdAt);

  return result;
} 

// Function to toggle user verification status
export async function verifiedUser(userId: number, value: boolean) {
  // Check current verification status of the user
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    return { success: false, message: "User not found." };
  }

  const isVerified = existingUser[0].verified;

  if (value) {
    // Trying to verify the user
    if (isVerified) {
      return { success: false, message: "Already Verified!" };
    }

    await db
      .update(users)
      .set({ verified: true })
      .where(eq(users.id, userId));

    return { success: true, message: "User is now Verified" };
  } else {
    // Trying to unverify the user
    if (!isVerified) {
      return { success: false, message: "Oops! This user is not verified yet." };
    }

    await db
      .update(users)
      .set({ verified: false })
      .where(eq(users.id, userId));

    return { success: true, message: "User is now unverified!" };
  }
}

// Function to delete a user and associated data
export async function DeleteUser(userId: number) {
  // Step 1: Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUser.length === 0) {
    throw new Error(`User with ID ${userId} not found.`);
  }

  // Step 2: Fetch all chatIds for the user
  const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
  const chatIds = userChats.map((chat) => chat.chatId);

  // Step 3: Delete related messages (only if chats exist)
  if (chatIds.length > 0) {
    await db.delete(messages).where(inArray(messages.chatId, chatIds));
  }

  // Step 4: Delete from favoriteChats (safe to attempt even if none)
  await db.delete(favoriteChats).where(eq(favoriteChats.userId, userId));

  // Step 5: Delete chats (if any)
  if (userChats.length > 0) {
    await db.delete(chats).where(eq(chats.userId, userId));
  }

  // Step 6: Delete user
  await db.delete(users).where(eq(users.id, userId));

  return {
    success: true,
    message: `User ${userId} and all related data deleted.`,
  };
} 