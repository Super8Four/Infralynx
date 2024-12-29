import { Pool as PgPool } from 'pg';
import * as mssql from 'mssql';
import { logger } from '../utils/logger';
import { DatabaseError } from '../types/errors';

// Configuration types
interface DBConfig {
    maxConnections: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    retryAttempts: number;
    retryDelay: number;
}

// Enhanced pool configurations
const pgPool = new PgPool({
    max: process.env.DB_MAX_CONNECTIONS || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const mssqlPool = new mssql.ConnectionPool({
    user: 'your_mssql_user',
    password: 'your_mssql_password',
    server: 'localhost',
    database: 'your_mssql_database',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
    },
});

// Connection retry wrapper
const withRetry = async (operation: () => Promise<any>, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// Transaction support
export const withTransaction = async <T>(callback: (client: any) => Promise<T>) => {
    const client = await pgPool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw new DatabaseError('Transaction failed', error);
    } finally {
        client.release();
    }
};

// Query with logging and timing
export const executePostgresQuery = async (query: string, params: any[] = []) => {
    const start = Date.now();
    try {
        const result = await withRetry(async () => {
            const client = await pgPool.connect();
            try {
                const res = await client.query(query, params);
                return res.rows;
            } finally {
                client.release();
            }
        });
        
        logger.info({
            query,
            duration: Date.now() - start,
            rowCount: result.length
        });
        
        return result;
    } catch (error) {
        logger.error({
            query,
            error,
            duration: Date.now() - start
        });
        throw new DatabaseError('Query execution failed', error);
    }
};

// Health check
export const checkDatabaseHealth = async () => {
    try {
        await executePostgresQuery('SELECT 1');
        return true;
    } catch (error) {
        logger.error('Database health check failed', error);
        return false;
    }
};

// Event listeners for pool
pgPool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pgPool.on('connect', (client) => {
    logger.info('New client connected to database');
});

// Clean up on application shutdown
process.on('SIGINT', async () => {
    await pgPool.end();
    process.exit(0);
});

// Function to connect to MS SQL
export const connectToMSSQL = async () => {
    try {
        await mssqlPool.connect();
        console.log('Connected to MS SQL');
    } catch (error) {
        console.error('Error connecting to MS SQL', error);
    }
};

// Function to execute a query on MS SQL
export const executeMSSQLQuery = async (query: string, params: any[]) => {
    const request = mssqlPool.request();
    params.forEach((param) => {
        request.input(param.name, param.value);
    });
    const result = await request.query(query);
    return result.recordset;
};