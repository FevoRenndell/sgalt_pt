// src/config/appConfig.js

// Crea un objeto de configuración llamado `config`
// Este objeto contiene valores clave como el entorno actual, el puerto y los datos de conexión a la base de datos.
const config = {
  // Entorno de ejecución (por ejemplo: 'development', 'production', etc.)
  // Si no está definido, se asume que estamos en desarrollo ('development').
  env: process.env.NODE_ENV || 'development',

  // Puerto en el que se ejecutará el servidor Express
  // Si no se define en el archivo .env, se usará por defecto el puerto 3000.
  port: process.env.PORT || 3000,

  // Configuración para conectarse a la base de datos PostgreSQL
  db: {
    host: process.env.DB_HOST,         // Dirección del servidor de la base de datos
    port: process.env.DB_PORT,         // Puerto en el que escucha PostgreSQL (por defecto 5432)
    user: process.env.DB_USER,         // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    name: process.env.DB_NAME,         // Nombre de la base de datos
  },
};

// Exporta el objeto `config` para que pueda ser utilizado en otras partes del backend
module.exports = config;
