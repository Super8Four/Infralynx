import { randomUUID } from 'node:crypto';

import {
  cidrSchema,
  createIpAddressSchema,
  createIpRangeSchema,
  createPrefixSchema,
} from '@infralynx/shared';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Router, type Response } from 'express';
import { z } from 'zod';

import { db } from '../db/client.js';
import {
  aggregates,
  auditEvents,
  ipAddresses,
  ipRanges,
  prefixRoles,
  prefixes,
  rirs,
  sites,
  vrfs,
} from '../db/schema.js';

export const ipamRouter = Router();

const prefixIdSchema = z.uuid();
const createRirSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000),
});
const createPrefixRoleSchema = createRirSchema;
const createAggregateSchema = z.object({
  rirId: z.uuid(),
  cidr: cidrSchema,
  status: z.enum(['active', 'reserved', 'deprecated', 'available']),
  description: z.string().trim().max(1000),
  owner: z.string().trim().max(200),
});

const parentPrefix = alias(prefixes, 'parent_prefix');
const aggregateRir = alias(rirs, 'aggregate_rir');

const prefixSelection = {
  id: prefixes.id,
  vrfId: prefixes.vrfId,
  vrfName: vrfs.name,
  siteId: prefixes.siteId,
  siteName: sites.name,
  aggregateId: prefixes.aggregateId,
  aggregateCidr: aggregates.prefix,
  roleId: prefixes.roleId,
  roleName: prefixRoles.name,
  parentId: prefixes.parentId,
  parentCidr: parentPrefix.prefix,
  cidr: prefixes.prefix,
  family: prefixes.family,
  status: prefixes.status,
  description: prefixes.description,
  owner: prefixes.owner,
};

const ipAddressSelection = {
  id: ipAddresses.id,
  vrfId: ipAddresses.vrfId,
  vrfName: vrfs.name,
  prefixId: ipAddresses.prefixId,
  prefixCidr: prefixes.prefix,
  address: ipAddresses.address,
  family: ipAddresses.family,
  status: ipAddresses.status,
  dnsName: ipAddresses.dnsName,
  description: ipAddresses.description,
  owner: ipAddresses.owner,
};

const ipRangeSelection = {
  id: ipRanges.id,
  vrfId: ipRanges.vrfId,
  vrfName: vrfs.name,
  prefixId: ipRanges.prefixId,
  prefixCidr: prefixes.prefix,
  startAddress: ipRanges.startAddress,
  endAddress: ipRanges.endAddress,
  prefixLength: ipRanges.prefixLength,
  family: ipRanges.family,
  status: ipRanges.status,
  description: ipRanges.description,
  owner: ipRanges.owner,
};

function familyFor(address: string) {
  return address.includes(':') ? 'ipv6' : 'ipv4';
}

function validationError(response: Response, message: string) {
  response.status(400).json({ error: { code: 'validation_error', message } });
}

async function containingPrefix(vrfId: string, address: string) {
  const [parent] = await db
    .select({ id: prefixes.id })
    .from(prefixes)
    .where(
      sql`${prefixes.vrfId} = ${vrfId} and ${prefixes.prefix} >>= ${address}::inet`,
    )
    .orderBy(desc(sql`masklen(${prefixes.prefix})`))
    .limit(1);
  return parent;
}

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

ipamRouter.get('/rirs', async (_request, response) => {
  response.json(await db.select().from(rirs).orderBy(asc(rirs.name)));
});

ipamRouter.post('/rirs', async (request, response) => {
  const parsed = createRirSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, 'Invalid RIR data.');
  try {
    const [created] = await db.insert(rirs).values(parsed.data).returning();
    response.status(201).json(created);
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      response.status(409).json({
        error: {
          code: 'already_exists',
          message: 'That RIR already exists.',
        },
      });
      return;
    }
    throw error;
  }
});

ipamRouter.get('/aggregates', async (_request, response) => {
  response.json(
    await db
      .select({
        id: aggregates.id,
        rirId: aggregates.rirId,
        rirName: aggregateRir.name,
        cidr: aggregates.prefix,
        family: aggregates.family,
        status: aggregates.status,
        description: aggregates.description,
        owner: aggregates.owner,
      })
      .from(aggregates)
      .innerJoin(aggregateRir, eq(aggregates.rirId, aggregateRir.id))
      .orderBy(asc(aggregates.prefix)),
  );
});

ipamRouter.post('/aggregates', async (request, response) => {
  const parsed = createAggregateSchema.safeParse(request.body);
  if (!parsed.success)
    return validationError(response, 'Invalid aggregate data.');
  try {
    const [created] = await db.transaction(async (transaction) => {
      const [aggregate] = await transaction
        .insert(aggregates)
        .values({
          ...parsed.data,
          prefix: parsed.data.cidr,
          family: familyFor(parsed.data.cidr),
          description: parsed.data.description || null,
          owner: parsed.data.owner || null,
        })
        .returning();
      if (!aggregate) throw new Error('Aggregate insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'aggregate',
        entityId: aggregate.id,
        requestId: randomUUID(),
        after: parsed.data,
      });
      return [aggregate];
    });
    response.status(201).json(created);
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      response.status(409).json({
        error: {
          code: 'aggregate_exists',
          message: 'That aggregate already exists.',
        },
      });
      return;
    }
    throw error;
  }
});

ipamRouter.get('/prefix-roles', async (_request, response) => {
  response.json(
    await db.select().from(prefixRoles).orderBy(asc(prefixRoles.name)),
  );
});

ipamRouter.post('/prefix-roles', async (request, response) => {
  const parsed = createPrefixRoleSchema.safeParse(request.body);
  if (!parsed.success)
    return validationError(response, 'Invalid prefix role data.');
  const [created] = await db
    .insert(prefixRoles)
    .values(parsed.data)
    .returning();
  response.status(201).json(created);
});

ipamRouter.get('/prefixes', async (_request, response) => {
  const rows = await db
    .select(prefixSelection)
    .from(prefixes)
    .innerJoin(vrfs, eq(prefixes.vrfId, vrfs.id))
    .leftJoin(sites, eq(prefixes.siteId, sites.id))
    .leftJoin(aggregates, eq(prefixes.aggregateId, aggregates.id))
    .leftJoin(prefixRoles, eq(prefixes.roleId, prefixRoles.id))
    .leftJoin(parentPrefix, eq(prefixes.parentId, parentPrefix.id))
    .orderBy(asc(prefixes.prefix));
  response.json(rows);
});

ipamRouter.post('/prefixes', async (request, response) => {
  const parsed = createPrefixSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response, 'Invalid prefix data.');
  const input = parsed.data;
  try {
    const createdId = await db.transaction(async (transaction) => {
      const parent = await containingPrefix(input.vrfId, input.cidr);
      const [aggregate] = await transaction
        .select({ id: aggregates.id })
        .from(aggregates)
        .where(sql`${aggregates.prefix} >>= ${input.cidr}::cidr`)
        .orderBy(desc(sql`masklen(${aggregates.prefix})`))
        .limit(1);
      const [created] = await transaction
        .insert(prefixes)
        .values({
          vrfId: input.vrfId,
          siteId: input.siteId ?? null,
          roleId: input.roleId ?? null,
          aggregateId: aggregate?.id ?? null,
          parentId: parent?.id ?? null,
          prefix: input.cidr,
          family: familyFor(input.cidr),
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
        after: {
          ...input,
          parentId: parent?.id ?? null,
          aggregateId: aggregate?.id ?? null,
        },
      });
      return created.id;
    });
    const [created] = await db
      .select(prefixSelection)
      .from(prefixes)
      .innerJoin(vrfs, eq(prefixes.vrfId, vrfs.id))
      .leftJoin(sites, eq(prefixes.siteId, sites.id))
      .leftJoin(aggregates, eq(prefixes.aggregateId, aggregates.id))
      .leftJoin(prefixRoles, eq(prefixes.roleId, prefixRoles.id))
      .leftJoin(parentPrefix, eq(prefixes.parentId, parentPrefix.id))
      .where(eq(prefixes.id, createdId));
    response.status(201).json(created);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === '23505') {
      response.status(409).json({
        error: {
          code: 'prefix_exists',
          message: 'That prefix already exists in this VRF.',
        },
      });
      return;
    }
    if (code === '22P02' || code === '23503') {
      return validationError(
        response,
        'The prefix, site, role, or VRF is invalid.',
      );
    }
    throw error;
  }
});

ipamRouter.get('/ip-addresses', async (_request, response) => {
  response.json(
    await db
      .select(ipAddressSelection)
      .from(ipAddresses)
      .innerJoin(vrfs, eq(ipAddresses.vrfId, vrfs.id))
      .innerJoin(prefixes, eq(ipAddresses.prefixId, prefixes.id))
      .orderBy(asc(ipAddresses.address)),
  );
});

ipamRouter.post('/ip-addresses', async (request, response) => {
  const parsed = createIpAddressSchema.safeParse(request.body);
  if (!parsed.success)
    return validationError(response, 'Invalid IP address data.');
  const input = parsed.data;
  const createdId = await db.transaction(async (transaction) => {
    const parent = await containingPrefix(input.vrfId, input.address);
    if (!parent) return null;
    const [created] = await transaction
      .insert(ipAddresses)
      .values({
        vrfId: input.vrfId,
        prefixId: parent.id,
        address: input.address,
        family: familyFor(input.address),
        status: input.status,
        dnsName: input.dnsName || null,
        description: input.description || null,
        owner: input.owner || null,
      })
      .returning({ id: ipAddresses.id });
    if (!created) throw new Error('IP address insert returned no record.');
    await transaction.insert(auditEvents).values({
      action: 'create',
      entityType: 'ip_address',
      entityId: created.id,
      requestId: randomUUID(),
      after: { ...input, prefixId: parent.id },
    });
    return created.id;
  });
  if (!createdId)
    return validationError(
      response,
      'Create a containing prefix in this VRF first.',
    );
  const [created] = await db
    .select(ipAddressSelection)
    .from(ipAddresses)
    .innerJoin(vrfs, eq(ipAddresses.vrfId, vrfs.id))
    .innerJoin(prefixes, eq(ipAddresses.prefixId, prefixes.id))
    .where(eq(ipAddresses.id, createdId));
  response.status(201).json(created);
});

ipamRouter.get('/ip-ranges', async (_request, response) => {
  response.json(
    await db
      .select(ipRangeSelection)
      .from(ipRanges)
      .innerJoin(vrfs, eq(ipRanges.vrfId, vrfs.id))
      .innerJoin(prefixes, eq(ipRanges.prefixId, prefixes.id))
      .orderBy(asc(ipRanges.startAddress)),
  );
});

ipamRouter.post('/ip-ranges', async (request, response) => {
  const parsed = createIpRangeSchema.safeParse(request.body);
  if (!parsed.success)
    return validationError(response, 'Invalid IP range data.');
  const input = parsed.data;
  if (familyFor(input.startAddress) !== familyFor(input.endAddress))
    return validationError(
      response,
      'Range addresses must use the same address family.',
    );
  const createdId = await db.transaction(async (transaction) => {
    const parent = await containingPrefix(input.vrfId, input.startAddress);
    if (!parent) return null;
    const [containsEnd] = await transaction
      .select({ id: prefixes.id })
      .from(prefixes)
      .where(
        sql`${prefixes.id} = ${parent.id} and ${prefixes.prefix} >>= ${input.endAddress}::inet`,
      )
      .limit(1);
    if (!containsEnd) return null;
    const [created] = await transaction
      .insert(ipRanges)
      .values({
        vrfId: input.vrfId,
        prefixId: parent.id,
        startAddress: input.startAddress,
        endAddress: input.endAddress,
        prefixLength: input.prefixLength,
        family: familyFor(input.startAddress),
        status: input.status,
        description: input.description || null,
        owner: input.owner || null,
      })
      .returning({ id: ipRanges.id });
    if (!created) throw new Error('IP range insert returned no record.');
    await transaction.insert(auditEvents).values({
      action: 'create',
      entityType: 'ip_range',
      entityId: created.id,
      requestId: randomUUID(),
      after: { ...input, prefixId: parent.id },
    });
    return created.id;
  });
  if (!createdId)
    return validationError(
      response,
      'Both range boundaries must be inside one prefix in this VRF.',
    );
  const [created] = await db
    .select(ipRangeSelection)
    .from(ipRanges)
    .innerJoin(vrfs, eq(ipRanges.vrfId, vrfs.id))
    .innerJoin(prefixes, eq(ipRanges.prefixId, prefixes.id))
    .where(eq(ipRanges.id, createdId));
  response.status(201).json(created);
});

ipamRouter.delete('/prefixes/:id', async (request, response) => {
  const parsedId = prefixIdSchema.safeParse(request.params.id);
  if (!parsedId.success) return validationError(response, 'Invalid prefix ID.');
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
