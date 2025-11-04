// src/controllers/pingController.js

// -----------------------------------------------------------------------------
// Controlador responsable de manejar la ruta GET /ping
// Su objetivo es verificar que el servidor y la API estén funcionando correctamente.
// -----------------------------------------------------------------------------

// Importamos la función `getPingMessage` desde el servicio correspondiente.
// Esta función devuelve el mensaje de respuesta utilizado en la comprobación de estado.
import { getPingMessage } from '../services/pingService.js';

/**
 * Controlador de la ruta /ping
 *
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 *
 * La función obtiene un mensaje desde el servicio y lo devuelve en formato JSON.
 * Es útil para pruebas de disponibilidad del servidor (endpoint de "salud").
 */
export const ping = (req, res) => {
  const message = getPingMessage(); // Mensaje generado desde el servicio
  res.json({ message }); // Respuesta en formato JSON
};
