import { Sequelize } from 'sequelize';
import config from '../db/config.js';
import initModels from './init-models.js';

const db = {};

// Conexión
const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    dialect: config.dialect || 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    logging: false,
    define: {
      paranoid: false,
      freezeTableName: true,
      timestamps: false,
    },
  },
);

// iniciar modelos
const models = initModels(sequelize);

// Armar objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.models = { ...models };
db.Op = Sequelize.Op;

export default db;
