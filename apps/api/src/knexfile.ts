import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hyperform_dev',
    },
    migrations: {
      directory: './src/infra/database/migrations',
    },
    seeds: {
      directory: './src/infra/database/seeds',
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: Number(process.env.TEST_DB_PORT) || 3306,
      user: process.env.TEST_DB_USER || 'root',
      password: process.env.TEST_DB_PASSWORD || '',
      database: process.env.TEST_DB_NAME || 'hyperform_test',
    },
    migrations: {
      directory: './src/infra/database/migrations',
    },
    seeds: {
      directory: './src/infra/database/seeds',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/infra/database/migrations',
    },
    seeds: {
      directory: './src/infra/database/seeds',
    },
  },
};

export default config;
