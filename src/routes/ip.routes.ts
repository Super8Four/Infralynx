import { Router } from 'express';
import {
  createIPPrefix,
  getIPPrefixes,
  getIPPrefix,
  updateIPPrefix,
  deleteIPPrefix,
  createIPAddress,
  getIPAddresses,
  getIPAddress,
  updateIPAddress,
  deleteIPAddress,
} from '../controllers/ip.controller';
import { validate } from '../middleware/validate';
import {
  createIPPrefixSchema,
  updateIPPrefixSchema,
  getIPPrefixSchema,
  createIPAddressSchema,
  updateIPAddressSchema,
  getIPAddressSchema,
} from '../schemas/ip.schema';

const router = Router();

// IP Prefix routes
router.post('/prefixes', validate(createIPPrefixSchema), createIPPrefix);
router.get('/prefixes', getIPPrefixes);
router.get('/prefixes/:id', validate(getIPPrefixSchema), getIPPrefix);
router.patch('/prefixes/:id', validate(updateIPPrefixSchema), updateIPPrefix);
router.delete('/prefixes/:id', validate(getIPPrefixSchema), deleteIPPrefix);

// IP Address routes
router.post('/addresses', validate(createIPAddressSchema), createIPAddress);
router.get('/addresses', getIPAddresses);
router.get('/addresses/:id', validate(getIPAddressSchema), getIPAddress);
router.patch('/addresses/:id', validate(updateIPAddressSchema), updateIPAddress);
router.delete('/addresses/:id', validate(getIPAddressSchema), deleteIPAddress);

export default router; 