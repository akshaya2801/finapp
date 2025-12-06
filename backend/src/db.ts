import { Pool, PoolClient } from 'pg';
import dns from 'dns';

// Force IPv4 resolution
dns.setDefaultResultOrder('ipv4first');

let pool: any;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
  });
} catch (err: any) {
  console.warn('Database connection not available:', err.message);
  // Create a mock pool for development
  pool = {
    query: () => Promise.reject(new Error('Database not configured')),
    connect: () => Promise.reject(new Error('Database not configured')),
  };
}

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const getClient = () => {
  return pool.connect();
};

export default pool;
