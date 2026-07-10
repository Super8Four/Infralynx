import { describe, expect, it } from 'vitest';

import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  it('accepts the API health response contract', () => {
    const result = healthResponseSchema.safeParse({
      status: 'ok',
      service: 'infralynx-api',
      version: '0.1.0',
      timestamp: '2026-07-10T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });
});
