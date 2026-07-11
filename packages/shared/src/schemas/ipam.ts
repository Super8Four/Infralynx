import { z } from 'zod';

export const addressFamilySchema = z.enum(['ipv4', 'ipv6']);
export const resourceStatusSchema = z.enum([
  'active',
  'reserved',
  'deprecated',
  'available',
]);

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

export type AddressFamily = z.infer<typeof addressFamilySchema>;
export type ResourceStatus = z.infer<typeof resourceStatusSchema>;
export type SiteSummary = z.infer<typeof siteSummarySchema>;
export type VrfSummary = z.infer<typeof vrfSummarySchema>;
export type PrefixSummary = z.infer<typeof prefixSummarySchema>;
export type CreatePrefix = z.infer<typeof createPrefixSchema>;
