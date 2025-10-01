# 📘 SGALT – Entorno con Docker

Este proyecto está configurado para ejecutarse completamente en contenedores usando **Docker Compose**.  
Incluye los siguientes servicios:

- 🟢 **Backend** → API en Node.js (puerto `3000`)  
- 🔵 **Frontend** → Aplicación en React + Vite (puerto `5173`)  
- 🟣 **PostgreSQL** → Base de datos (puerto `5432`)  

---

## 🚀 Requisitos previos
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

Verifica la instalación con:
```bash
docker --version
docker-compose --version
```

---

## ⚙️ Levantar el entorno

En la raíz del proyecto (`SGALT_PT/`):

```bash
docker-compose up --build
```

Esto:
- Construye las imágenes de **backend** y **frontend**.  
- Levanta los tres servicios (frontend, backend y db).  
- Expone los puertos:  
  - Frontend → [http://localhost:5173](http://localhost:5173)  
  - Backend → [http://localhost:3000](http://localhost:3000)  
  - PostgreSQL → `localhost:5432`

---

## 🔄 Detener servicios

Para detener y eliminar los contenedores creados por Docker Compose:

```bash
docker-compose down
```

---

## 👀 Logs en vivo

Ver los logs de todos los servicios:
```bash
docker-compose logs -f
```

Ver solo los logs del backend:
```bash
docker-compose logs -f backend
```

---

## 💻 Desarrollo

- El código fuente del **backend** (`./backend`) y **frontend** (`./frontend`) está montado como volumen dentro de los contenedores.  
- Esto significa que cualquier cambio en los archivos locales **se refleja automáticamente** dentro del contenedor.  
- En el frontend, Vite hace **hot reload**.  
- En el backend, si usas `nodemon`, se recarga automáticamente al detectar cambios.

👉 Por lo tanto, **no es necesario ejecutar `npm run dev` en tu host local**.  

---

## 🗄️ Base de datos

El servicio de PostgreSQL se levanta con:
- **Usuario:** `postgres`  
- **Contraseña:** `postgres`  
- **Base de datos:** `sgalt`  

Los datos se almacenan en un volumen persistente (`db_data`), por lo que no se pierden al detener los contenedores.

---

## 🧹 Reconstruir imágenes

Si realizas cambios en los `Dockerfile` o en las dependencias (`package.json`), reconstruye las imágenes con:

```bash
docker-compose up --build
```

---

✅ Con este setup, solo necesitas **Docker** para desarrollar y ejecutar el proyecto completo.  
