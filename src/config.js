import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.APP_PORT || 8000,

  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  DB_DIALECT: process.env.DB_DIALECT || 'sqlite',
  DB_HOST: process.env.DB_HOST || './dev.sqlite',
};

export const { PORT, JWT_SECRET, JWT_EXPIRES_IN, DB_DIALECT, DB_HOST } = config;
