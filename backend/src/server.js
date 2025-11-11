import 'dotenv/config';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
// import logger from './utils/logger.js';
import initRoutes from './routes/init-routes.js';

const app = express();
const port =  4000;

// Crear el servidor HTTP
const server = http.createServer(app);

// Configuraciones de seguridad y middleware
app.use(express.json());
app.use(helmet());
 
app.use(
  cors({
    origin: ['http://192.168.1.90:5173',],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Limitador de tasa
const limiter = rateLimit({
  windowMs: 15 * 60 * 50000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API corriendo ✅' });
});

// Inicializar las rutas
initRoutes('sgal_pt', app);

// Manejo de errores
//errorManager(app, { logger });

// Listar todos los endpoints registrados
const endpoints = listEndpoints(app);
endpoints.forEach((endpoint) => {
  console.log(endpoint.path, ' ', endpoint.methods);
});

// Iniciar el servidor HTTP
server.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});



// (Opcional) exportar app si lo necesitas para tests u otros usos
export default app;
