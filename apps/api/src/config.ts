import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  API_PORT: z.coerce.number().int().positive().max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://infralynx:change-me@localhost:5432/infralynx'),
  SESSION_SECRET: z
    .string()
    .min(32)
    .default('development-only-secret-change-me-now'),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_PATH: z.string().min(1).default('./storage'),
});

export const config = environmentSchema.parse(process.env);
