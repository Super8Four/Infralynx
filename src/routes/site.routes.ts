import { Router } from 'express';
import {
  createSite,
  getSites,
  getSite,
  updateSite,
  deleteSite,
} from '../controllers/site.controller';
import { validate } from '../middleware/validate';
import {
  createSiteSchema,
  updateSiteSchema,
  getSiteSchema,
} from '../schemas/site.schema';

const router = Router();

router.post('/', validate(createSiteSchema), createSite);
router.get('/', getSites);
router.get('/:id', validate(getSiteSchema), getSite);
router.patch('/:id', validate(updateSiteSchema), updateSite);
router.delete('/:id', validate(getSiteSchema), deleteSite);

export default router; 