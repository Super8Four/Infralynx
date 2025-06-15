import { z } from 'zod';

export const createDeviceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    status: z.string().min(1, 'Status is required'),
    rackId: z.number().optional(),
    siteId: z.number().optional(),
  }),
});

export const updateDeviceSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    type: z.string().min(1, 'Type is required').optional(),
    status: z.string().min(1, 'Status is required').optional(),
    rackId: z.number().optional(),
    siteId: z.number().optional(),
  }),
});

export const getDeviceSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
}); 