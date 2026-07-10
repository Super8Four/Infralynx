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

export const prefixSummarySchema = z.object({
  id: z.uuid(),
  cidr: z.string().trim().min(3).max(64),
  family: addressFamilySchema,
  status: resourceStatusSchema,
  description: z.string().max(1000).nullable(),
});

export type AddressFamily = z.infer<typeof addressFamilySchema>;
export type ResourceStatus = z.infer<typeof resourceStatusSchema>;
export type SiteSummary = z.infer<typeof siteSummarySchema>;
export type PrefixSummary = z.infer<typeof prefixSummarySchema>;
