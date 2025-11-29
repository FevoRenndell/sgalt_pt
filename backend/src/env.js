// src/config/env.js
import dotenv from 'dotenv';
import path from 'path';

// Load correct file
dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? path.resolve('./src/.env.production')       // ← AQUÍ
    : path.resolve('./src/.env.development')  
});

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT || 3000),

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'sgalt',
    dialect: 'postgres',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.SMTP_FROM_NAME || 'SGALT',
    fromEmail: process.env.SMTP_FROM_EMAIL,
  }
};

// JWT validation
if (!env.jwt.secret) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

export default env;
