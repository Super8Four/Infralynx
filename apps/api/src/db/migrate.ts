import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { fileURLToPath } from 'node:url';

import { db, pool } from './client.js';

try {
  await migrate(db, {
    migrationsFolder: fileURLToPath(new URL('../../drizzle', import.meta.url)),
  });
  console.log('Database migrations completed.');
} finally {
  await pool.end();
}
