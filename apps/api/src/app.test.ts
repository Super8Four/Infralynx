import { healthResponseSchema } from '@infralynx/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createApp } from './app.js';

describe('Infralynx API', () => {
  it('returns a valid versioned health response', async () => {
    const response = await request(createApp())
      .get('/api/v1/health')
      .expect(200);
    expect(healthResponseSchema.safeParse(response.body).success).toBe(true);
  });

  it('serves the OpenAPI contract', async () => {
    const response = await request(createApp())
      .get('/api/v1/openapi.json')
      .expect(200);
    const document = z
      .object({ info: z.object({ title: z.string() }) })
      .parse(response.body as unknown);
    expect(document.info.title).toBe('Infralynx API');
  });

  it('rejects invalid prefix data before querying PostgreSQL', async () => {
    const response = await request(createApp())
      .post('/api/v1/ipam/prefixes')
      .send({ cidr: 'not-a-prefix' })
      .expect(400);
    expect(response.body).toMatchObject({
      error: { code: 'validation_error' },
    });
  });
});
