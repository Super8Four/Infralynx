import { Pool } from 'pg'; // For PostgreSQL
import { ConnectionPool } from 'mssql'; // For MS SQL

// PostgreSQL configuration
const pgPool = new Pool({
    user: 'your_pg_user',
    host: 'localhost',
    database: 'your_pg_database',
    password: 'your_pg_password',
    port: 5432,
});

// MS SQL configuration
const mssqlPool = new ConnectionPool({
    user: 'your_mssql_user',
    password: 'your_mssql_password',
    server: 'localhost',
    database: 'your_mssql_database',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
    },
});

// Function to connect to PostgreSQL
export const connectToPostgres = async () => {
    try {
        await pgPool.connect();
        console.log('Connected to PostgreSQL');
    } catch (error) {
        console.error('Error connecting to PostgreSQL', error);
    }
};

// Function to connect to MS SQL
export const connectToMSSQL = async () => {
    try {
        await mssqlPool.connect();
        console.log('Connected to MS SQL');
    } catch (error) {
        console.error('Error connecting to MS SQL', error);
    }
};

// Function to execute a query on PostgreSQL
export const executePostgresQuery = async (query: string, params: any[]) => {
    const client = await pgPool.connect();
    try {
        const res = await client.query(query, params);
        return res.rows;
    } finally {
        client.release();
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