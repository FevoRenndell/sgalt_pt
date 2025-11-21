// config/database.js

import { Sequelize } from 'sequelize';
import config from './config.js'; // Asegúrate de que este es el archivo correcto con la configuración de Sequelize

const environment = process.env.NODE_ENV || 'development';
const envConfig = config[environment];

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    host: envConfig.host,
    dialect: envConfig.dialect,
    timezone: 'America/Santiago', // Ajusta según tu zona horaria
    dialectOptions: {
      useUTC: false, // Evita el uso de UTC si prefieres la hora local
    },
    // más configuraciones si es necesario
  },
);

export default sequelize;
