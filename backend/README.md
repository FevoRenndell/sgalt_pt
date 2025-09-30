# 🚀 Backend Básico con Express.js

Este proyecto es una API básica construida con Node.js y Express, organizada por capas (`routes`, `controllers`, `services`) y preparada para conectarse a una base de datos PostgreSQL en el futuro.

---

## 📁 Estructura del Proyecto

```
backend/
├── server.js                  # Punto de entrada del servidor
├── src/
│   ├── routes/
│   │   └── index.js           # Rutas del backend
│   ├── controllers/
│   │   └── pingController.js  # Lógica del controlador
│   └── services/
│       └── pingService.js     # Lógica de negocio / servicio
```

---

## 📦 Requisitos Previos

- Node.js instalado
- (Opcional) PostgreSQL si se requiere persistencia de datos (no obligatorio para esta prueba)

---

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://tu-repo.git
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

---

## ▶️ Ejecución del Servidor

```bash
node server.js
```

Verás en consola:

```
Servidor escuchando en el puerto 3000
```

---

## 🔁 Endpoint de Prueba

Una vez levantado el servidor, puedes probar el siguiente endpoint:

### `GET /api/ping`

- **URL completa:** `http://localhost:3000/api/ping`
- **Respuesta esperada:**

```json
{
  "message": "pong"
}
```

Este endpoint sirve para verificar que el backend Express está funcionando correctamente.

---

## 🧪 ¿Cómo funciona este endpoint?

- `server.js` monta el archivo `src/routes/index.js` bajo `/api`.
- En `routes/index.js` se define la ruta `/ping`.
- Esta ruta ejecuta el método `ping` del `pingController`.
- El controlador se apoya en `pingService` para generar una respuesta `"pong"`.

---

## 📌 Notas Adicionales

- Por ahora **no es necesario tener PostgreSQL instalado**. Más adelante puedes crear un archivo `.env` para la conexión a la base de datos con `pg` o `sequelize`.
- Si recibes un error 404, asegúrate de que estés usando la ruta correcta: `http://localhost:3000/api/ping`.

---

## 📚 Próximos pasos sugeridos

- Agregar middlewares como `cors` y `body-parser`.
- Agregar conexión real con PostgreSQL usando Sequelize o `pg`.
- Crear un sistema de autenticación básico.
- Usar variables de entorno con `dotenv`.

---

## 👨‍💻 Autor

> Desarrollado por Cristian Reyes — [QALITIC SpA · GEOCONTROL](https://geocontrol.cl)
