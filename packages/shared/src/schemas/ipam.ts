import { z } from 'zod';

export const addressFamilySchema = z.enum(['ipv4', 'ipv6']);
export const resourceStatusSchema = z.enum([
  'active',
  'reserved',
  'deprecated',
  'available',
]);
export const facilityStatusSchema = z.enum(['active', 'planned', 'retired']);

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, numbers, and hyphens only.',
  });

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);

const optionalCoordinate = (minimum: number, maximum: number) =>
  z
    .union([z.string(), z.number()])
    .transform((value) => (String(value).trim() ? String(value).trim() : null))
    .refine(
      (value) =>
        value === null ||
        (!Number.isNaN(Number(value)) &&
          Number(value) >= minimum &&
          Number(value) <= maximum),
      `Enter a coordinate between ${minimum} and ${maximum}.`,
    );

const hierarchyFields = {
  name: z.string().trim().min(1).max(100),
  slug: slugSchema,
  parentId: z.uuid().nullable(),
  description: optionalText(1000),
  owner: optionalText(200),
  comments: optionalText(10_000),
};

export const regionSchema = z.object({
  id: z.uuid(),
  ...hierarchyFields,
});
export const createRegionSchema = z.object({
  ...hierarchyFields,
  slug: slugSchema.optional(),
});

export const siteGroupSchema = z.object({
  id: z.uuid(),
  ...hierarchyFields,
});
export const createSiteGroupSchema = z.object({
  ...hierarchyFields,
  slug: slugSchema.optional(),
});

export const siteSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  slug: slugSchema,
  status: facilityStatusSchema,
  regionId: z.uuid().nullable(),
  regionName: z.string().nullable(),
  groupId: z.uuid().nullable(),
  groupName: z.string().nullable(),
  facility: z.string().max(100).nullable(),
  timeZone: z.string().max(100).nullable(),
  description: z.string().max(1000).nullable(),
  physicalAddress: z.string().max(10_000).nullable(),
  shippingAddress: z.string().max(10_000).nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  owner: z.string().max(200).nullable(),
  comments: z.string().max(10_000).nullable(),
});
export const createSiteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: slugSchema.optional(),
  status: facilityStatusSchema,
  regionId: z.uuid().nullable(),
  groupId: z.uuid().nullable(),
  facility: optionalText(100),
  timeZone: optionalText(100),
  description: optionalText(1000),
  physicalAddress: optionalText(10_000),
  shippingAddress: optionalText(10_000),
  latitude: optionalCoordinate(-90, 90),
  longitude: optionalCoordinate(-180, 180),
  owner: optionalText(200),
  comments: optionalText(10_000),
});

export const locationSchema = z.object({
  id: z.uuid(),
  siteId: z.uuid(),
  siteName: z.string(),
  name: z.string().trim().min(1).max(100),
  slug: slugSchema,
  status: facilityStatusSchema,
  parentId: z.uuid().nullable(),
  parentName: z.string().nullable(),
  facility: z.string().max(100).nullable(),
  description: z.string().max(1000).nullable(),
  owner: z.string().max(200).nullable(),
  comments: z.string().max(10_000).nullable(),
});
export const createLocationSchema = z.object({
  siteId: z.uuid(),
  name: z.string().trim().min(1).max(100),
  slug: slugSchema.optional(),
  status: facilityStatusSchema,
  parentId: z.uuid().nullable(),
  facility: optionalText(100),
  description: optionalText(1000),
  owner: optionalText(200),
  comments: optionalText(10_000),
});

export const siteSummarySchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  description: z.string().max(1000).nullable(),
});

export const vrfSummarySchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  routeDistinguisher: z.string().max(100).nullable(),
  description: z.string().max(1000).nullable(),
});

export const cidrSchema = z
  .string()
  .trim()
  .min(3)
  .max(64)
  .refine((value) => {
    const [address, length, ...rest] = value.split('/');
    if (!address || !length || rest.length > 0 || !/^\d+$/.test(length))
      return false;
    const prefixLength = Number(length);
    if (address.includes(':')) return prefixLength >= 0 && prefixLength <= 128;
    const octets = address.split('.');
    return (
      prefixLength >= 0 &&
      prefixLength <= 32 &&
      octets.length === 4 &&
      octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) <= 255)
    );
  }, 'Enter a valid IPv4 or IPv6 CIDR prefix.');

export const prefixSummarySchema = z.object({
  id: z.uuid(),
  vrfId: z.uuid(),
  vrfName: z.string(),
  siteId: z.uuid().nullable(),
  siteName: z.string().nullable(),
  cidr: cidrSchema,
  family: addressFamilySchema,
  status: resourceStatusSchema,
  description: z.string().max(1000).nullable(),
  owner: z.string().max(200).nullable(),
});

export const createPrefixSchema = z.object({
  vrfId: z.uuid(),
  siteId: z.uuid().nullable(),
  cidr: cidrSchema,
  status: resourceStatusSchema,
  description: z.string().trim().max(1000),
  owner: z.string().trim().max(200),
});

export const prefixListSchema = z.array(prefixSummarySchema);
export const siteListSchema = z.array(siteSummarySchema);
export const vrfListSchema = z.array(vrfSummarySchema);
export const regionListSchema = z.array(regionSchema);
export const siteGroupListSchema = z.array(siteGroupSchema);
export const facilitySiteListSchema = z.array(siteSchema);
export const locationListSchema = z.array(locationSchema);

export type AddressFamily = z.infer<typeof addressFamilySchema>;
export type ResourceStatus = z.infer<typeof resourceStatusSchema>;
export type FacilityStatus = z.infer<typeof facilityStatusSchema>;
export type SiteSummary = z.infer<typeof siteSummarySchema>;
export type VrfSummary = z.infer<typeof vrfSummarySchema>;
export type PrefixSummary = z.infer<typeof prefixSummarySchema>;
export type CreatePrefix = z.infer<typeof createPrefixSchema>;
export type Region = z.infer<typeof regionSchema>;
export type CreateRegion = z.infer<typeof createRegionSchema>;
export type SiteGroup = z.infer<typeof siteGroupSchema>;
export type CreateSiteGroup = z.infer<typeof createSiteGroupSchema>;
export type FacilitySite = z.infer<typeof siteSchema>;
export type CreateSite = z.infer<typeof createSiteSchema>;
export type Location = z.infer<typeof locationSchema>;
export type CreateLocation = z.infer<typeof createLocationSchema>;
