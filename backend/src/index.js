// src/index.js

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa el módulo Express
const express = require('express');

// Inicializa la aplicación Express
const app = express();

// Importa la función que conecta a la base de datos desde /config/db.js
const { connectDB } = require('./config/db');

// Importa el manejador de rutas desde /routes/index.js (por defecto busca index.js en esa carpeta)
const router = require('./routes');

// =====================
// Middlewares
// =====================

// Middleware que permite a Express interpretar los cuerpos de las peticiones como JSON
app.use(express.json()); // Permite recibir datos en formato JSON (por ejemplo, en POST)

// =====================
// Rutas
// =====================

// Todas las rutas definidas en routes/ serán accesibles bajo la URL /api
// Por ejemplo, si en routes defines "/ping", esta será accesible como "/api/ping"
app.use('/api', router);

// =====================
// Conexión a la base de datos
// =====================

// Ejecuta la función que se conecta a la base de datos PostgreSQL
connectDB();

// Exporta la aplicación configurada para ser utilizada en server.js
module.exports = app;
