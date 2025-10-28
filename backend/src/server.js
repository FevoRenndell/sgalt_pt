// src/server.js

// -----------------------------------------------------------------------------
// Servidor HTTP principal de SGALT (Express + ESM)
// -----------------------------------------------------------------------------
import express from 'express';
import dotenv from 'dotenv';
import pingRoute from './routes/pingRoute.js';
import { connectDB } from './config/db.js'; // Verifica la conexión antes de iniciar

// Carga variables de entorno desde .env (PORT, DB_*, NODE_ENV, etc.)
dotenv.config();

// Instancia de Express y middlewares básicos
const app = express();
app.use(express.json()); // Permite recibir JSON en el body

// Rutas de la API
app.use('/api', pingRoute);

// Ruta raíz (healthcheck simple)
app.get('/', (_req, res) => {
  res.send('🟢 Backend SGALT en funcionamiento');
});

// Puerto de escucha (normalizado a number)
const PORT = Number(process.env.PORT) || 3000;

/**
 * Arranca la aplicación:
 * 1) Verifica conectividad a PostgreSQL (fail-fast si hay error).
 * 2) Levanta el servidor HTTP.
 */
async function start() {
  try {
    await connectDB(); // Lanza error si no hay conexión
    app
      .listen(PORT, () => {
        console.log(
          `🚀 Servidor backend corriendo en http://localhost:${PORT} [Modo: ${process.env.NODE_ENV || 'development'}]`
        );
      })
      .on('error', (err) => {
        console.error(`❌ Error al iniciar el servidor: ${err.message}`);
      });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor por error de base de datos:', err.message);
    process.exit(1); // Corta el proceso si no hay DB
  }
}

start();

// Export opcional (útil para tests/supertests si los agregas luego)
export default app;
