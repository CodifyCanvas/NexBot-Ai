// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',  // Path to your schema file
  out: './drizzle/migrations',    // Path for migration output
  dialect: 'mysql',                   // MySQL dialect
  dbCredentials: {
  url: process.env.DATABASE_URL!,
  ssl: {
    ca: process.env.MYSQL_CA_CERT?.replace(/\\n/g, '\n'),
  },
},
});
