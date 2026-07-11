import { describe, expect, it } from 'vitest';

import { healthResponseSchema } from './health.js';
import { cidrSchema, regionSchema } from './ipam.js';

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

describe('cidrSchema', () => {
  it.each(['192.0.2.0/24', '10.0.0.0/8', '2001:db8::/32'])(
    'accepts %s',
    (cidr) => expect(cidrSchema.safeParse(cidr).success).toBe(true),
  );

  it.each(['192.0.2.1', '999.1.1.1/24', '10.0.0.0/33', '2001:db8::/129'])(
    'rejects %s',
    (cidr) => expect(cidrSchema.safeParse(cidr).success).toBe(false),
  );
});

describe('regionSchema', () => {
  it('accepts nullable optional fields returned by PostgreSQL', () => {
    expect(
      regionSchema.safeParse({
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Validation Region',
        slug: 'validation-region',
        parentId: null,
        description: null,
        owner: null,
        comments: null,
      }).success,
    ).toBe(true);
  });
});
