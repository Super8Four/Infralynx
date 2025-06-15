import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Site API', () => {
    describe('GET /api/sites', () => {
        it('should return empty array when no sites exist', async () => {
            const response = await request(app).get('/api/sites');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return all sites', async () => {
            // Create test site
            await prisma.site.create({
                data: {
                    name: 'Test Site',
                    address: 'Test Address'
                }
            });

            const response = await request(app).get('/api/sites');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('name', 'Test Site');
        });
    });

    describe('GET /api/sites/:id', () => {
        it('should return 404 for non-existent site', async () => {
            const response = await request(app).get('/api/sites/999');
            expect(response.status).toBe(404);
        });

        it('should return site by id', async () => {
            const site = await prisma.site.create({
                data: {
                    name: 'Test Site',
                    address: 'Test Address'
                }
            });

            const response = await request(app).get(`/api/sites/${site.id}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'Test Site');
        });
    });

    describe('POST /api/sites', () => {
        it('should create new site', async () => {
            const siteData = {
                name: 'New Site',
                address: 'New Address'
            };

            const response = await request(app)
                .post('/api/sites')
                .send(siteData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'New Site');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/sites')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Validation Error');
        });

        it('should not allow duplicate site names', async () => {
            // Create initial site
            await prisma.site.create({
                data: {
                    name: 'Test Site',
                    address: 'Test Address'
                }
            });

            // Try to create site with same name
            const response = await request(app)
                .post('/api/sites')
                .send({
                    name: 'Test Site',
                    address: 'Different Address'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Bad Request');
        });
    });
}); 