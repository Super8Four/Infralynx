import { randomUUID } from 'node:crypto';

import { createPrefixSchema } from '@infralynx/shared';
import { asc, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';

import { db } from '../db/client.js';
import { auditEvents, prefixes, sites, vrfs } from '../db/schema.js';

export const ipamRouter = Router();

const prefixIdSchema = z.uuid();

const prefixSelection = {
  id: prefixes.id,
  vrfId: prefixes.vrfId,
  vrfName: vrfs.name,
  siteId: prefixes.siteId,
  siteName: sites.name,
  cidr: prefixes.prefix,
  family: prefixes.family,
  status: prefixes.status,
  description: prefixes.description,
  owner: prefixes.owner,
};

ipamRouter.get('/sites', async (_request, response) => {
  response.json(
    await db
      .select({
        id: sites.id,
        name: sites.name,
        slug: sites.slug,
        description: sites.description,
      })
      .from(sites)
      .orderBy(asc(sites.name)),
  );
});

ipamRouter.get('/vrfs', async (_request, response) => {
  response.json(
    await db
      .select({
        id: vrfs.id,
        name: vrfs.name,
        routeDistinguisher: vrfs.routeDistinguisher,
        description: vrfs.description,
      })
      .from(vrfs)
      .orderBy(asc(vrfs.name)),
  );
});

ipamRouter.get('/prefixes', async (_request, response) => {
  const rows = await db
    .select(prefixSelection)
    .from(prefixes)
    .innerJoin(vrfs, eq(prefixes.vrfId, vrfs.id))
    .leftJoin(sites, eq(prefixes.siteId, sites.id))
    .orderBy(asc(prefixes.prefix));
  response.json(rows);
});

ipamRouter.post('/prefixes', async (request, response) => {
  const parsed = createPrefixSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: 'validation_error',
        message: 'Invalid prefix data.',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const input = parsed.data;
  const family = input.cidr.includes(':') ? 'ipv6' : 'ipv4';
  try {
    const createdId = await db.transaction(async (transaction) => {
      const [created] = await transaction
        .insert(prefixes)
        .values({
          vrfId: input.vrfId,
          siteId: input.siteId ?? null,
          prefix: input.cidr,
          family,
          status: input.status,
          description: input.description || null,
          owner: input.owner || null,
        })
        .returning({ id: prefixes.id });
      if (!created) throw new Error('Prefix insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'prefix',
        entityId: created.id,
        requestId: randomUUID(),
        after: input,
      });
      return created.id;
    });

    const [created] = await db
      .select(prefixSelection)
      .from(prefixes)
      .innerJoin(vrfs, eq(prefixes.vrfId, vrfs.id))
      .leftJoin(sites, eq(prefixes.siteId, sites.id))
      .where(eq(prefixes.id, createdId));
    response.status(201).json(created);
  } catch (error) {
    const databaseError = error as { code?: string };
    if (databaseError.code === '23505') {
      response.status(409).json({
        error: {
          code: 'prefix_exists',
          message: 'That prefix already exists in this VRF.',
        },
      });
      return;
    }
    if (databaseError.code === '22P02' || databaseError.code === '23503') {
      response.status(400).json({
        error: {
          code: 'invalid_reference',
          message: 'The prefix, site, or VRF is invalid.',
        },
      });
      return;
    }
    throw error;
  }
});

ipamRouter.delete('/prefixes/:id', async (request, response) => {
  const parsedId = prefixIdSchema.safeParse(request.params.id);
  if (!parsedId.success) {
    response.status(400).json({
      error: { code: 'validation_error', message: 'Invalid prefix ID.' },
    });
    return;
  }

  const deleted = await db.transaction(async (transaction) => {
    const [existing] = await transaction
      .select()
      .from(prefixes)
      .where(eq(prefixes.id, parsedId.data));
    if (!existing) return false;
    await transaction.delete(prefixes).where(eq(prefixes.id, parsedId.data));
    await transaction.insert(auditEvents).values({
      action: 'delete',
      entityType: 'prefix',
      entityId: existing.id,
      requestId: randomUUID(),
      before: existing,
    });
    return true;
  });

  if (!deleted) {
    response
      .status(404)
      .json({ error: { code: 'not_found', message: 'Prefix not found.' } });
    return;
  }
  response.status(204).send();
});
