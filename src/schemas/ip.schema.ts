import { z } from 'zod';

// Helper function to validate IP address format
const isValidIP = (ip: string) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Helper function to validate CIDR notation
const isValidCIDR = (cidr: string) => {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  
  const ip = parts[0];
  const mask = parseInt(parts[1]);
  
  if (!isValidIP(ip)) return false;
  if (isNaN(mask) || mask < 0 || mask > 128) return false;
  
  return true;
};

export const createIPPrefixSchema = z.object({
  body: z.object({
    prefix: z.string().refine(isValidCIDR, 'Invalid CIDR notation'),
    description: z.string().optional(),
    status: z.enum(['Active', 'Reserved', 'Deprecated']),
    siteId: z.number().optional(),
    parentId: z.number().optional(),
  }),
});

export const updateIPPrefixSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    prefix: z.string().refine(isValidCIDR, 'Invalid CIDR notation').optional(),
    description: z.string().optional(),
    status: z.enum(['Active', 'Reserved', 'Deprecated']).optional(),
    siteId: z.number().optional(),
    parentId: z.number().optional(),
  }),
});

export const getIPPrefixSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
});

export const createIPAddressSchema = z.object({
  body: z.object({
    address: z.string().refine(isValidIP, 'Invalid IP address'),
    description: z.string().optional(),
    status: z.enum(['Active', 'Reserved', 'Deprecated']),
    deviceId: z.number().optional(),
    prefixId: z.number().optional(),
  }),
});

export const updateIPAddressSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    address: z.string().refine(isValidIP, 'Invalid IP address').optional(),
    description: z.string().optional(),
    status: z.enum(['Active', 'Reserved', 'Deprecated']).optional(),
    deviceId: z.number().optional(),
    prefixId: z.number().optional(),
  }),
});

export const getIPAddressSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
}); 