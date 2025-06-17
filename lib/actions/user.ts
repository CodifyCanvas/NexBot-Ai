// lib/data/user.ts
"use server"
import { users } from '@/drizzle/schema'
import { eq, and } from "drizzle-orm";
import { db } from '../db'

export async function userSignup(name: string, email: string, password: string) {
  // Check if the email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));

  if (existingUser.length > 0) {
    return { success: false, message: 'User already exists' };
  }

  await db.insert(users).values({
    name: name,
    email: email,
    password: password,
    profileImg: '',
  });

  return { success: true };
}

export async function fetchUserForLogin(email: string, password: string) {
  if (!email || !password) {
    console.error("Missing email or password.");
    return null;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password), eq(users.verified, true)))
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
      verified: users.verified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user || null;
}

export async function updateUserProfileImage(userId: number, imagePath: string) {
  const result = await db
    .update(users)
    .set({ profileImg: imagePath })
    .where(eq(users.id, userId));

  return result || null;
}

export async function updateUserName(userId: number, name: string) {
  const result = await db
      .update(users)
      .set({ name: name })
      .where(eq(users.id, userId))

  return result || null;
}

export async function banUserAccount(userId: number) {
  const result = await db
      .update(users)
      .set({ verified: false })
      .where(eq(users.id, userId))

  return result || null;
}

export async function changeUserPassword(userId: number, newPassword: string) {
  const result = await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.id, userId));

  return result ?? null;
}

export async function verifyUserPassword(userId: number, password: string): Promise<boolean> {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(and(eq(users.id, userId), eq(users.password, password)))
    .limit(1);

  return !!user; // true if match found, false otherwise
} 


