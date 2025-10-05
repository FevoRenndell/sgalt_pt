// ✅ Importamos el módulo 'express', que es el framework web que usaremos para manejar rutas y peticiones HTTP.
import express from 'express';

// ✅ Importamos 'dotenv', que permite leer variables de entorno desde un archivo .env y usarlas en el proyecto.
import dotenv from 'dotenv';

// ✅ Importamos todas las rutas.
import pingRoute from './routes/pingRoute.js';

// ✅ Configuramos dotenv para que cargue automáticamente las variables definidas en el archivo .env
dotenv.config();

// ✅ Obtenemos el número de puerto desde la variable de entorno PORT (definida en el archivo .env).
// Si no está definida, usamos el puerto 3000 como valor por defecto.
// Usamos Number() para asegurarnos que el valor sea numérico.
const PORT = Number(process.env.PORT) || 3000;

// ✅ Creamos una instancia de la aplicación Express.
const app = express();

// ✅ Este middleware permite que Express entienda solicitudes entrantes con cuerpo (body) en formato JSON.
// Es decir, podremos recibir objetos JSON en las rutas sin errores.
app.use(express.json());

// Montamos las rutas importadas.
app.use('/api', pingRoute);

/*
  ✅ Ruta raíz del backend:
  Esta ruta GET responde a cualquier solicitud hecha a '/' con un mensaje de texto.
  Es útil como "heartbeat" o comprobación de salud del servidor para verificar que está activo.
*/
app.get('/', (req, res) => {
  res.send('🟢 Backend SGALT en funcionamiento');
});

/*
  ✅ Método .listen():
  Inicia el servidor para que escuche en el puerto definido (3000 o el que esté en el .env).
  Cuando el servidor arranca correctamente, imprime un mensaje en consola.
  También incluye una función .on('error') para capturar e informar si ocurre un error al iniciar.
*/
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT} [Modo: ${process.env.NODE_ENV || 'development'}]`);
}).on('error', (err) => {
  console.error(`❌ Error al iniciar el servidor: ${err.message}`);
});
// El servidor ahora está listo para manejar rutas adicionales y peticiones HTTP.