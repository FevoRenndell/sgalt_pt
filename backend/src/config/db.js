// src/config/db.js

// Se importa la clase Pool del paquete 'pg'
// 'Pool' permite manejar múltiples conexiones a PostgreSQL.
const { Pool } = require('pg');

// Se importa la configuración general desde appConfig.js
const config = require('./appConfig');

// Se crea una nueva instancia del pool de conexiones con PostgreSQL
// Utiliza los valores extraídos desde las variables de entorno (.env) por medio del objeto `config`
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
});

// Función asincrónica para intentar conectarse a la base de datos
const connectDB = async () => {
  try {
    await pool.connect(); // Intenta conectarse al pool
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
};

// Exporta tanto la función `connectDB` como el `pool`
// Esto permite utilizar la conexión o el pool en otros archivos del proyecto.
module.exports = {
  connectDB,
  pool,
};