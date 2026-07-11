import { randomUUID } from 'node:crypto';

import {
  createLocationSchema,
  createRegionSchema,
  createSiteGroupSchema,
  createSiteSchema,
} from '@infralynx/shared';
import { asc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Router, type Response } from 'express';

import { db } from '../db/client.js';
import {
  auditEvents,
  locations,
  regions,
  siteGroups,
  sites,
} from '../db/schema.js';

export const facilitiesRouter = Router();

const locationSite = alias(sites, 'location_site');
const parentLocation = alias(locations, 'parent_location');

const facilitySiteSelection = {
  id: sites.id,
  name: sites.name,
  slug: sites.slug,
  status: sites.status,
  regionId: sites.regionId,
  regionName: regions.name,
  groupId: sites.groupId,
  groupName: siteGroups.name,
  facility: sites.facility,
  timeZone: sites.timeZone,
  description: sites.description,
  physicalAddress: sites.physicalAddress,
  shippingAddress: sites.shippingAddress,
  latitude: sites.latitude,
  longitude: sites.longitude,
  owner: sites.owner,
  comments: sites.comments,
};

const locationSelection = {
  id: locations.id,
  siteId: locations.siteId,
  siteName: locationSite.name,
  name: locations.name,
  slug: locations.slug,
  status: locations.status,
  parentId: locations.parentId,
  parentName: parentLocation.name,
  facility: locations.facility,
  description: locations.description,
  owner: locations.owner,
  comments: locations.comments,
};

function defaultSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function validationError(response: Response) {
  response.status(400).json({
    error: { code: 'validation_error', message: 'Invalid facility data.' },
  });
}

function databaseError(error: unknown, response: Response) {
  const code = (error as { code?: string }).code;
  if (code === '23505') {
    response.status(409).json({
      error: {
        code: 'already_exists',
        message: 'A facility record with that name or slug already exists.',
      },
    });
    return true;
  }
  if (code === '23503' || code === '22P02') {
    response.status(400).json({
      error: {
        code: 'invalid_reference',
        message: 'One of the selected facility records does not exist.',
      },
    });
    return true;
  }
  return false;
}

facilitiesRouter.get('/regions', async (_request, response) => {
  response.json(
    await db
      .select({
        id: regions.id,
        name: regions.name,
        slug: regions.slug,
        parentId: regions.parentId,
        description: regions.description,
        owner: regions.owner,
        comments: regions.comments,
      })
      .from(regions)
      .orderBy(asc(regions.name)),
  );
});

facilitiesRouter.post('/regions', async (request, response) => {
  const parsed = createRegionSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response);
  const input = {
    ...parsed.data,
    slug: parsed.data.slug ?? defaultSlug(parsed.data.name),
  };
  if (input.parentId) {
    const [parent] = await db
      .select({ id: regions.id })
      .from(regions)
      .where(eq(regions.id, input.parentId));
    if (!parent) return validationError(response);
  }
  try {
    const [created] = await db.transaction(async (transaction) => {
      const [region] = await transaction
        .insert(regions)
        .values(input)
        .returning();
      if (!region) throw new Error('Region insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'region',
        entityId: region.id,
        requestId: randomUUID(),
        after: input,
      });
      return [region];
    });
    response.status(201).json(created);
  } catch (error) {
    if (databaseError(error, response)) return;
    throw error;
  }
});

facilitiesRouter.get('/site-groups', async (_request, response) => {
  response.json(
    await db
      .select({
        id: siteGroups.id,
        name: siteGroups.name,
        slug: siteGroups.slug,
        parentId: siteGroups.parentId,
        description: siteGroups.description,
        owner: siteGroups.owner,
        comments: siteGroups.comments,
      })
      .from(siteGroups)
      .orderBy(asc(siteGroups.name)),
  );
});

facilitiesRouter.post('/site-groups', async (request, response) => {
  const parsed = createSiteGroupSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response);
  const input = {
    ...parsed.data,
    slug: parsed.data.slug ?? defaultSlug(parsed.data.name),
  };
  if (input.parentId) {
    const [parent] = await db
      .select({ id: siteGroups.id })
      .from(siteGroups)
      .where(eq(siteGroups.id, input.parentId));
    if (!parent) return validationError(response);
  }
  try {
    const [created] = await db.transaction(async (transaction) => {
      const [siteGroup] = await transaction
        .insert(siteGroups)
        .values(input)
        .returning();
      if (!siteGroup) throw new Error('Site group insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'site_group',
        entityId: siteGroup.id,
        requestId: randomUUID(),
        after: input,
      });
      return [siteGroup];
    });
    response.status(201).json(created);
  } catch (error) {
    if (databaseError(error, response)) return;
    throw error;
  }
});

facilitiesRouter.get('/sites', async (_request, response) => {
  response.json(
    await db
      .select(facilitySiteSelection)
      .from(sites)
      .leftJoin(regions, eq(sites.regionId, regions.id))
      .leftJoin(siteGroups, eq(sites.groupId, siteGroups.id))
      .orderBy(asc(sites.name)),
  );
});

facilitiesRouter.post('/sites', async (request, response) => {
  const parsed = createSiteSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response);
  const input = {
    ...parsed.data,
    slug: parsed.data.slug ?? defaultSlug(parsed.data.name),
  };
  try {
    const createdId = await db.transaction(async (transaction) => {
      const [site] = await transaction
        .insert(sites)
        .values(input)
        .returning({ id: sites.id });
      if (!site) throw new Error('Site insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'site',
        entityId: site.id,
        requestId: randomUUID(),
        after: input,
      });
      return site.id;
    });
    const [created] = await db
      .select(facilitySiteSelection)
      .from(sites)
      .leftJoin(regions, eq(sites.regionId, regions.id))
      .leftJoin(siteGroups, eq(sites.groupId, siteGroups.id))
      .where(eq(sites.id, createdId));
    response.status(201).json(created);
  } catch (error) {
    if (databaseError(error, response)) return;
    throw error;
  }
});

facilitiesRouter.get('/locations', async (_request, response) => {
  response.json(
    await db
      .select(locationSelection)
      .from(locations)
      .innerJoin(locationSite, eq(locations.siteId, locationSite.id))
      .leftJoin(parentLocation, eq(locations.parentId, parentLocation.id))
      .orderBy(asc(locationSite.name), asc(locations.name)),
  );
});

facilitiesRouter.post('/locations', async (request, response) => {
  const parsed = createLocationSchema.safeParse(request.body);
  if (!parsed.success) return validationError(response);
  const input = {
    ...parsed.data,
    slug: parsed.data.slug ?? defaultSlug(parsed.data.name),
  };
  if (input.parentId) {
    const [parent] = await db
      .select({ siteId: locations.siteId })
      .from(locations)
      .where(eq(locations.id, input.parentId));
    if (!parent || parent.siteId !== input.siteId)
      return validationError(response);
  }
  try {
    const createdId = await db.transaction(async (transaction) => {
      const [location] = await transaction
        .insert(locations)
        .values(input)
        .returning({ id: locations.id });
      if (!location) throw new Error('Location insert returned no record.');
      await transaction.insert(auditEvents).values({
        action: 'create',
        entityType: 'location',
        entityId: location.id,
        requestId: randomUUID(),
        after: input,
      });
      return location.id;
    });
    const [created] = await db
      .select(locationSelection)
      .from(locations)
      .innerJoin(locationSite, eq(locations.siteId, locationSite.id))
      .leftJoin(parentLocation, eq(locations.parentId, parentLocation.id))
      .where(eq(locations.id, createdId));
    response.status(201).json(created);
  } catch (error) {
    if (databaseError(error, response)) return;
    throw error;
  }
});
