import { Router } from 'express';
import {
  createRack,
  getRacks,
  getRack,
  updateRack,
  deleteRack,
} from '../controllers/rack.controller';
import { validate } from '../middleware/validate';
import {
  createRackSchema,
  updateRackSchema,
  getRackSchema,
} from '../schemas/rack.schema';

const router = Router();

router.post('/', validate(createRackSchema), createRack);
router.get('/', getRacks);
router.get('/:id', validate(getRackSchema), getRack);
router.patch('/:id', validate(updateRackSchema), updateRack);
router.delete('/:id', validate(getRackSchema), deleteRack);

export default router; 