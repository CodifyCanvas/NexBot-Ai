// lib/db.ts
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '@/drizzle/schema' // or your correct path

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
})

export const db = drizzle(pool, {
  schema,
  mode: 'default', // ✅ this fixes the error
})
