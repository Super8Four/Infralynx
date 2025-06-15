import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Device API', () => {
    let testSite: any;
    let testRack: any;

    beforeEach(async () => {
        // Create test site
        testSite = await prisma.site.create({
            data: {
                name: 'Test Site',
                address: 'Test Address'
            }
        });

        // Create test rack
        testRack = await prisma.rack.create({
            data: {
                name: 'Test Rack',
                location: 'Test Location',
                capacity: 42,
                siteId: testSite.id
            }
        });
    });

    describe('GET /api/devices', () => {
        it('should return empty array when no devices exist', async () => {
            const response = await request(app).get('/api/devices');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return all devices', async () => {
            // Create test device
            await prisma.device.create({
                data: {
                    name: 'Test Device',
                    type: 'Server',
                    status: 'Active',
                    rackId: testRack.id,
                    siteId: testSite.id
                }
            });

            const response = await request(app).get('/api/devices');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('name', 'Test Device');
        });
    });

    describe('GET /api/devices/:id', () => {
        it('should return 404 for non-existent device', async () => {
            const response = await request(app).get('/api/devices/999');
            expect(response.status).toBe(404);
        });

        it('should return device by id', async () => {
            const device = await prisma.device.create({
                data: {
                    name: 'Test Device',
                    type: 'Server',
                    status: 'Active',
                    rackId: testRack.id,
                    siteId: testSite.id
                }
            });

            const response = await request(app).get(`/api/devices/${device.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Test Device');
        });
    });

    describe('POST /api/devices', () => {
        it('should create new device', async () => {
            const deviceData = {
                name: 'New Device',
                type: 'Server',
                status: 'Active',
                rackId: testRack.id,
                siteId: testSite.id
            };

            const response = await request(app)
                .post('/api/devices')
                .send(deviceData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'New Device');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/devices')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });

        it('should handle invalid rack reference', async () => {
            const deviceData = {
                name: 'New Device',
                type: 'Server',
                status: 'Active',
                rackId: 999
            };

            const response = await request(app)
                .post('/api/devices')
                .send(deviceData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
        });
    });
}); 