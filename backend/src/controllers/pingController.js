// Importamos la función getPingMessage desde el servicio
import { getPingMessage } from '../services/pingService.js';

// Definimos la función ping que será usada como manejador de la ruta GET /ping
export const ping = (req, res) => {
  // Obtenemos un mensaje desde el servicio
  const message = getPingMessage();

  // Devolvemos una respuesta JSON con el mensaje
  res.json({ message });
};
