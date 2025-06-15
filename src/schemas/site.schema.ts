import { z } from 'zod';

export const createSiteSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
  }),
});

export const updateSiteSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    address: z.string().min(1, 'Address is required').optional(),
  }),
});

export const getSiteSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
}); 