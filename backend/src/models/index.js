import { Sequelize } from 'sequelize';
import initModels from './init-models.js';
import env from '../env.js';
 
const db = {};

// Conexión
export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.pass,
  {
    dialect: env.db.dialect,
    host: env.db.host,
    port: env.db.port,
    logging: false,
    define: {
      paranoid: false,
      freezeTableName: true,
      timestamps: false,
    },
  }
)

// iniciar modelos
const models = initModels(sequelize);

// Armar objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.models = { ...models };
db.Op = Sequelize.Op;

export default db;
