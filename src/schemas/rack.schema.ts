import { z } from 'zod';

export const createRackSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    location: z.string().min(1, 'Location is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    siteId: z.number().optional(),
  }),
});

export const updateRackSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    location: z.string().min(1, 'Location is required').optional(),
    capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
    siteId: z.number().optional(),
  }),
});

export const getRackSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
}); 