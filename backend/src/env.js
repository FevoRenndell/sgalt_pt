// src/config/env.js
import dotenv from 'dotenv';
import path from 'path';

// Detectamos archivo correcto
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
    pass: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'sgalt',
    dialect: 'postgres',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES || '1d',
  },
};

// Validaciones
if (!env.jwt.secret) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

export default env;
