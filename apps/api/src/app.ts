import { randomUUID } from 'node:crypto';

import type { HealthResponse } from '@infralynx/shared';
import cookieParser from 'cookie-parser';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { pool } from './db/client.js';
import { openApiDocument } from './openapi.js';
import { ipamRouter } from './routes/ipam.js';
import { facilitiesRouter } from './routes/facilities.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use((request, response, next) => {
    const requestId = request.header('x-request-id') ?? randomUUID();
    response.setHeader('x-request-id', requestId);
    next();
  });

  app.get('/health/live', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.get('/health/ready', async (_request, response) => {
    try {
      await pool.query('select 1');
      response.json({ status: 'ok' });
    } catch {
      response.status(503).json({ status: 'unavailable' });
    }
  });

  app.get('/api/v1/health', (_request, response) => {
    const payload: HealthResponse = {
      status: 'ok',
      service: 'infralynx-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
    response.json(payload);
  });

  app.get('/api/v1/openapi.json', (_request, response) => {
    response.json(openApiDocument);
  });
  app.use('/api/v1/ipam', ipamRouter);
  app.use('/api/v1/facilities', facilitiesRouter);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: 'not_found',
        message: 'The requested resource was not found.',
      },
    });
  });

  const errorHandler: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next,
  ) => {
    console.error(error);
    response.status(500).json({
      error: {
        code: 'internal_error',
        message: 'An unexpected error occurred.',
      },
    });
  };
  app.use(errorHandler);

  return app;
}
