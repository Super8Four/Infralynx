import { PrismaClient } from '@prisma/client';

class DatabaseService {
    private static instance: DatabaseService;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    public async connect(): Promise<void> {
        try {
            await this.prisma.$connect();
            console.log('Successfully connected to database');
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.prisma.$disconnect();
            console.log('Successfully disconnected from database');
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }
}

export default DatabaseService; 