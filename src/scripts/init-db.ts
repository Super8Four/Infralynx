import { PrismaClient } from '@prisma/client';
import DatabaseService from '../services/database';

async function main() {
    const prisma = new PrismaClient();
    const db = DatabaseService.getInstance();

    try {
        // Connect to the database
        await db.connect();

        // Create initial data
        const site = await prisma.site.create({
            data: {
                name: 'Main Data Center',
                address: '123 Main St, City, Country'
            }
        });

        const rack = await prisma.rack.create({
            data: {
                name: 'Rack-01',
                location: 'Row A, Position 1',
                capacity: 42,
                siteId: site.id
            }
        });

        const device = await prisma.device.create({
            data: {
                name: 'Server-01',
                type: 'Server',
                status: 'Active',
                rackId: rack.id,
                siteId: site.id
            }
        });

        console.log('Database initialized with sample data:');
        console.log('Site:', site);
        console.log('Rack:', rack);
        console.log('Device:', device);

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        await db.disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    }); 