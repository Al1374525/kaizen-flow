/**
 * Knex configuration for database migrations
 */

require('dotenv').config();

const config = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:testpass@localhost:5432/kaizen_flow_test',
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgresql://postgres:testpass@localhost:5432/kaizen_flow_test',
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/seeds',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

module.exports = config;