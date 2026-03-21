/**
 * Database configuration and connection
 */

import knex, { Knex } from 'knex';
import { getEnv } from './env';

let db: Knex;

export function initializeDatabase(): Promise<void> {
  const env = getEnv();

  const config: Knex.Config = {
    client: 'pg',
    connection: env.DATABASE_URL,
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  };

  db = knex(config);

  // Test connection
  return db.raw('SELECT 1+1 AS result').then(() => {
    console.log('✅ Database connection test successful');
  });
}

export function getDb(): Knex {
  if (!db) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.'
    );
  }
  return db;
}

// Export for migrations/seeds - only export after initialization
export default {} as Knex;
