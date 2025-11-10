// Variables de entorno para configuración Sequelize (conexión a BD)
// src/db/config.js
import 'dotenv/config';

const config = {
  DB_HOST: process.env.DB_HOST || '192.168.1.90',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || '123456',  
  DB_NAME: process.env.DB_NAME || 'postgres',
  JWT_SECRET: process.env.JWT_SECRET || 'dtcpBFdOGyFJCKX7OrcSAkbhdyM3Z4MlQMbPAlqYoHwZe9MOilBfg1JSzX2FtAhp6Yv',
  dialect: 'postgres',
  env: process.env.NODE_ENV || 'development',
};

export default config;

 