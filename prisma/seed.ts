import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create sample site
    const site = await prisma.site.create({
        data: {
            name: 'Main Data Center',
            description: 'Primary data center location',
            address: '123 Main St, City, Country',
            status: 'ACTIVE',
        },
    });

    // Create sample rack
    const rack = await prisma.rack.create({
        data: {
            name: 'Rack-01',
            description: 'Main server rack',
            status: 'ACTIVE',
            siteId: site.id,
        },
    });

    // Create sample device
    const device = await prisma.device.create({
        data: {
            name: 'Server-01',
            description: 'Main application server',
            status: 'ACTIVE',
            rackId: rack.id,
        },
    });

    // Create sample IP prefixes
    const ipv4Prefix = await prisma.iPPrefix.create({
        data: {
            prefix: '192.168.1.0/24',
            description: 'Main network',
            status: 'ACTIVE',
            siteId: site.id,
        },
    });

    const ipv6Prefix = await prisma.iPPrefix.create({
        data: {
            prefix: '2001:db8::/32',
            description: 'IPv6 network',
            status: 'ACTIVE',
            siteId: site.id,
        },
    });

    // Create sample IP addresses
    await prisma.iPAddress.create({
        data: {
            address: '192.168.1.1',
            description: 'Gateway',
            status: 'ACTIVE',
            deviceId: device.id,
            prefixId: ipv4Prefix.id,
        },
    });

    await prisma.iPAddress.create({
        data: {
            address: '2001:db8::1',
            description: 'IPv6 Gateway',
            status: 'ACTIVE',
            deviceId: device.id,
            prefixId: ipv6Prefix.id,
        },
    });

    console.log('Database has been seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 