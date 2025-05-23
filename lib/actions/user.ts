// lib/data/user.ts
"use server"
import { users } from '@/drizzle/schema'
import { eq, and } from "drizzle-orm";
import { db } from '../db'

export async function fetchUserForLogin(email: string, password: string) {
  if (!email || !password) {
    console.error("Missing email or password.");
    return null;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)))
      .limit(1);

    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Database error during login:", error);
    return null;
  }
}

export async function fetchUser(userId: number) {
  const [user] = await db
    .select({
      id: users.id,
      profileImg: users.profileImg,
      name: users.name,
      admin: users.admin,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

