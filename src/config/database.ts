import { Pool } from 'pg';
import { ConnectionPool } from 'mssql';

const postgresConfig = {
    user: 'your_postgres_user',
    host: 'localhost',
    database: 'your_postgres_db',
    password: 'your_postgres_password',
    port: 5432,
};

const mssqlConfig = {
    user: 'your_mssql_user',
    password: 'your_mssql_password',
    server: 'localhost',
    database: 'your_mssql_db',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
    },
};

export const connectPostgres = async () => {
    const pool = new Pool(postgresConfig);
    return pool.connect();
};

export const connectMSSQL = async () => {
    const pool = new ConnectionPool(mssqlConfig);
    return pool.connect();
};