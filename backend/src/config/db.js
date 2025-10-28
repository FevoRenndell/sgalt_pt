// src/config/db.js

// -----------------------------------------------------------------------------
// Conexión a PostgreSQL usando un Pool (múltiples conexiones eficientes)
// Requiere que `appConfig.js` exponga las credenciales desde variables de entorno
// -----------------------------------------------------------------------------
import { Pool } from 'pg';
import config from './appConfig.js';

// Normalizamos tipos que vienen como string desde process.env
const DB_PORT = Number(config.db.port) || 5432;

// Pool único para toda la app (reutiliza conexiones y evita abrir una por request)
export const pool = new Pool({
  host: config.db.host,
  port: DB_PORT,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  // Si en el futuro se necesita SSL (p. ej., proveedores cloud), podría habilitarse:
  // ssl: { rejectUnauthorized: false },
});

/**
 * Verifica la conectividad a la base de datos.
 * - Abre una conexión del pool
 * - Ejecuta una consulta liviana (SELECT 1)
 * - Libera la conexión
 * Lanza el error hacia arriba si falla (útil para cortar el arranque del servidor).
 */
export async function connectDB() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    throw err;
  }
}

/**
 * Cierra ordenadamente el pool (para tests o apagados controlados).
 */
export async function closeDB() {
  await pool.end();
  console.log('🛑 Pool de PostgreSQL cerrado');
}