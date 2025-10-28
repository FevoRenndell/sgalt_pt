// src/routes/pingRoute.js

// -----------------------------------------------------------------------------
// Rutas relacionadas con las pruebas de disponibilidad del servidor (endpoint /ping)
// -----------------------------------------------------------------------------

import express from 'express';
import { ping } from '../controllers/pingController.js';

// Creamos una nueva instancia del enrutador de Express.
// Esto nos permite definir rutas agrupadas por funcionalidad.
const router = express.Router();

/**
 * Ruta: GET /ping
 * 
 * Objetivo:
 *  - Permite verificar si el servidor y la API están operativos.
 *  - Usa el controlador `ping` que devuelve un mensaje JSON desde el servicio.
 */
router.get('/ping', ping);

// Exportamos el router como exportación por defecto (ES Modules).
// Este módulo se importará dentro del archivo principal de rutas o en `server.js`.
export default router;
