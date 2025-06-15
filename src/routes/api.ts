import { Router } from 'express';
import DeviceController from '../controllers/devices';
import RackController from '../controllers/racks';
import SiteController from '../controllers/sites';
import { validateDevice, validateRack, validateSite } from '../utils/validation';

const router = Router();

const deviceController = new DeviceController();
const rackController = new RackController();
const siteController = new SiteController();

// Device routes
router.get('/devices', deviceController.getAllDevices.bind(deviceController));
router.get('/devices/:id', deviceController.getDeviceById.bind(deviceController));
router.post('/devices', validateDevice, deviceController.createDevice.bind(deviceController));

// Rack routes
router.get('/racks', rackController.getAllRacks.bind(rackController));
router.get('/racks/:id', rackController.getRackById.bind(rackController));
router.post('/racks', validateRack, rackController.createRack.bind(rackController));

// Site routes
router.get('/sites', siteController.getAllSites.bind(siteController));
router.get('/sites/:id', siteController.getSiteById.bind(siteController));
router.post('/sites', validateSite, siteController.createSite.bind(siteController));

export default router;