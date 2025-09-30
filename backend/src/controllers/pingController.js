// Importa el servicio que contiene la lógica del mensaje de respuesta
const pingService = require('../services/pingService');

// Define y exporta la función 'ping' que será usada como manejador de la ruta GET /ping
exports.ping = (req, res) => {
    // Obtiene un mensaje desde el servicio
    const message = pingService.getPingMessage();

    // Devuelve una respuesta JSON con el mensaje
    res.json({ message });
};