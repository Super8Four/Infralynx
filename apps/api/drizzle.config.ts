import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://infralynx:change-me@localhost:5432/infralynx',
  },
  strict: true,
  verbose: true,
});
