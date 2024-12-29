import request from 'supertest';
import app from '../../src/app'; // Adjust the path as necessary

describe('API Integration Tests', () => {
    it('should return a list of devices', async () => {
        const response = await request(app).get('/api/devices');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return a specific device by ID', async () => {
        const response = await request(app).get('/api/devices/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('should create a new device', async () => {
        const newDevice = { name: 'New Device', type: 'Sensor' };
        const response = await request(app).post('/api/devices').send(newDevice);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    // Add more tests for racks and sites as needed
});