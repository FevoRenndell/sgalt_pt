// src/services/pingService.js

// -----------------------------------------------------------------------------
// Servicio: pingService
// Encargado de proporcionar la lógica de negocio para el endpoint /ping.
// En este caso, simplemente devuelve el mensaje 'pong', que confirma que
// la aplicación y el servicio están activos.
// -----------------------------------------------------------------------------

/**
 * Devuelve un mensaje de respuesta simple para verificar el estado del servidor.
 * 
 * @returns {string} Mensaje de confirmación de que el servicio está operativo.
 */
export const getPingMessage = () => 'pong';
