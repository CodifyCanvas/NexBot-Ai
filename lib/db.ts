// lib/db.ts
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '@/drizzle/schema' // or your correct path

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST!,
  port: Number(process.env.MYSQL_PORT!),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  ssl: {
    ca: process.env.MYSQL_CA_CERT?.replace(/\\n/g, '\n'),
  },
});

export const db = drizzle(pool, {
  schema,
  mode: 'default', // ✅ this fixes the error
})
