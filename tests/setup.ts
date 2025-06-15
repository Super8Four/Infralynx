import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create a new Prisma client for testing
const prisma = new PrismaClient();

// Clean up database before each test
beforeEach(async () => {
    await prisma.device.deleteMany();
    await prisma.rack.deleteMany();
    await prisma.site.deleteMany();
});

// Close database connection after all tests
afterAll(async () => {
    await prisma.$disconnect();
}); 