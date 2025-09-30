// Importa la aplicación Express desde el archivo index.js dentro de src/
// Aquí es donde definimos y configuramos nuestra app (rutas, middlewares, etc.)
const app = require('./src/index');

// Obtiene el número de puerto desde la variable de entorno PORT (archivo .env)
// Si no existe, usará por defecto el puerto 3000
const PORT = process.env.PORT || 3000;

// Inicia el servidor para que escuche conexiones HTTP en el puerto definido
app.listen(PORT, () => {
  // Muestra un mensaje en la consola indicando que el servidor está funcionando
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
