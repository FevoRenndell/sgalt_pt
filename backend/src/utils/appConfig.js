// src/config/appConfig.js

// -----------------------------------------------------------------------------
// Importación de dependencias
// -----------------------------------------------------------------------------
// Importamos la librería `dotenv`, que permite cargar las variables definidas
// en el archivo `.env` dentro de `process.env`, para que estén disponibles
// en toda la aplicación.
import dotenv from 'dotenv';

// Llamamos a la función `config()` para inicializar dotenv y cargar las variables.
dotenv.config();

// -----------------------------------------------------------------------------
// Definición del objeto de configuración
// -----------------------------------------------------------------------------
// El objeto `config` centraliza toda la configuración principal del backend,
// incluyendo:
//   - El entorno actual (development, production, etc.)
//   - El puerto del servidor Express
//   - Las credenciales y parámetros de conexión a la base de datos PostgreSQL
// -----------------------------------------------------------------------------
const config = {
  // ---------------------------------------------------------------------------
  // Entorno de ejecución
  // ---------------------------------------------------------------------------
  // Indica en qué modo se está ejecutando la aplicación.
  // Si no se define la variable NODE_ENV en el archivo `.env`,
  // se asume que el entorno es "development".
  env: process.env.NODE_ENV || 'development',

  // ---------------------------------------------------------------------------
  // Puerto del servidor
  // ---------------------------------------------------------------------------
  // Define el puerto en el que el servidor Express escuchará las peticiones.
  // Si no se define la variable PORT en el archivo `.env`,
  // se utilizará el puerto 3000 por defecto.
  port: process.env.PORT || 3000,

  // ---------------------------------------------------------------------------
  // Configuración de la base de datos
  // ---------------------------------------------------------------------------
  // Estos valores son extraídos del archivo `.env`.
  // Asegúrate de definir las siguientes variables en dicho archivo:
  //   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
  db: {
    host: process.env.DB_HOST || 'localhost',   // Dirección del servidor de la BD
    port: process.env.DB_PORT || 5432,          // Puerto donde escucha PostgreSQL
    user: process.env.DB_USER || 'postgres',    // Usuario de la base de datos
    password: process.env.DB_PASSWORD || '',    // Contraseña del usuario
    name: process.env.DB_NAME || 'database',    // Nombre de la base de datos
  },
};

// -----------------------------------------------------------------------------
// Exportación del objeto de configuración
// -----------------------------------------------------------------------------
// Se exporta `config` como valor por defecto, lo que permite importarlo en
// cualquier otro módulo del proyecto usando la sintaxis moderna:
//
//   import config from './config/appConfig.js';
//
// -----------------------------------------------------------------------------
export default config;
