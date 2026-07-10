import { createApp } from './app.js';
import { config } from './config.js';
import { pool } from './db/client.js';

const app = createApp();
const server = app.listen(config.API_PORT, '0.0.0.0', () => {
  console.log(`Infralynx API listening on port ${config.API_PORT}`);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down.`);
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
