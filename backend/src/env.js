// src/config/env.js
import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres',
    name: process.env.DB_NAME || 'sgalt',
    dialect: 'postgres', // ignoramos DB_CONNECTION y fijamos el correcto
  },

  jwt: {
    secret: 'dtcpBFdOGyFJCKX7OrcSAkbhdyM3Z4MlQMbPAlqYoHwZe9MOilBfg1JSzX2FtAhp6Yv',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

if (!env.jwt.secret) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

export default env;
