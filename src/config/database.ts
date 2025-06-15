import { Pool } from 'pg';
import { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const postgresConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
};

const mssqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_HOST,
    database: process.env.MSSQL_DB,
    options: {
        encrypt: true,
        trustServerCertificate: process.env.NODE_ENV === 'development',
    },
};

export const connectPostgres = async () => {
    try {
        const pool = new Pool(postgresConfig);
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');
        return client;
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        throw error;
    }
};

export const connectMSSQL = async () => {
    try {
        const pool = new ConnectionPool(mssqlConfig);
        const client = await pool.connect();
        console.log('Successfully connected to MS SQL');
        return client;
    } catch (error) {
        console.error('Error connecting to MS SQL:', error);
        throw error;
    }
};