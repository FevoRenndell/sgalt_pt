// Importa el módulo Express para crear el router
const express = require('express');

// Crea una nueva instancia del enrutador de Express
const router = express.Router();

// Importa el controlador que contiene la lógica para la ruta /ping
const pingController = require('../controllers/pingController');

// Define la ruta GET /ping y asigna el método ping del controlador como manejador
// Esto significa que cuando se haga una petición GET a /ping, se ejecutará pingController.ping
router.get('/ping', pingController.ping);

// Exporta el router para que pueda ser utilizado en el archivo principal del servidor
module.exports = router;