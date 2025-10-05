import express from 'express';
// Importamos directamente la función ping desde el controlador
import { ping } from '../controllers/pingController.js';

const router = express.Router();

// Definimos la ruta GET /ping usando la función importada ping
router.get('/ping', ping);

// Exportamos el router usando export default (ES Modules)
export default router;