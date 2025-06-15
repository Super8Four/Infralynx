import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Rack API', () => {
    let testSite: any;

    beforeEach(async () => {
        // Create test site
        testSite = await prisma.site.create({
            data: {
                name: 'Test Site',
                address: 'Test Address'
            }
        });
    });

    describe('GET /api/racks', () => {
        it('should return empty array when no racks exist', async () => {
            const response = await request(app).get('/api/racks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return all racks', async () => {
            // Create test rack
            await prisma.rack.create({
                data: {
                    name: 'Test Rack',
                    location: 'Test Location',
                    capacity: 42,
                    siteId: testSite.id
                }
            });

            const response = await request(app).get('/api/racks');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('name', 'Test Rack');
        });
    });

    describe('GET /api/racks/:id', () => {
        it('should return 404 for non-existent rack', async () => {
            const response = await request(app).get('/api/racks/999');
            expect(response.status).toBe(404);
        });

        it('should return rack by id', async () => {
            const rack = await prisma.rack.create({
                data: {
                    name: 'Test Rack',
                    location: 'Test Location',
                    capacity: 42,
                    siteId: testSite.id
                }
            });

            const response = await request(app).get(`/api/racks/${rack.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Test Rack');
        });
    });

    describe('POST /api/racks', () => {
        it('should create new rack', async () => {
            const rackData = {
                name: 'New Rack',
                location: 'New Location',
                capacity: 48,
                siteId: testSite.id
            };

            const response = await request(app)
                .post('/api/racks')
                .send(rackData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'New Rack');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/racks')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });

        it('should handle invalid site reference', async () => {
            const rackData = {
                name: 'New Rack',
                location: 'New Location',
                capacity: 48,
                siteId: 999
            };

            const response = await request(app)
                .post('/api/racks')
                .send(rackData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
        });
    });
}); 