import { Router } from 'express';
import {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
} from '../controllers/device.controller';
import { validate } from '../middleware/validate';
import {
  createDeviceSchema,
  updateDeviceSchema,
  getDeviceSchema,
} from '../schemas/device.schema';

const router = Router();

router.post('/', validate(createDeviceSchema), createDevice);
router.get('/', getDevices);
router.get('/:id', validate(getDeviceSchema), getDevice);
router.patch('/:id', validate(updateDeviceSchema), updateDevice);
router.delete('/:id', validate(getDeviceSchema), deleteDevice);

export default router; 