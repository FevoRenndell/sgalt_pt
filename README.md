# 🧠 SGALT · Sistema de Gestión Administrativo de Laboratorios Técnicos

Proyecto **SGALT_PT** — Plataforma desarrollada con **Node.js**, **PostgreSQL** y **React (Vite)**, desplegada mediante **Docker Compose**.  
Su propósito es digitalizar los procesos administrativos y de control de calidad en laboratorios técnicos, integrando cotizaciones, gestión de usuarios, control de ensayos y administración de clientes.

---

## 🧩 Estructura del Proyecto

```
sgalt_pt/
├── backend/                # Servidor API (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── routes/         # Definición de rutas
│   │   ├── controllers/    # Lógica de endpoints
│   │   ├── services/       # Reglas de negocio
│   │   └── seed/           # Scripts de creación/reset de usuario administrador
│   ├── Dockerfile          # Imagen del servicio backend
│   ├── ENV.MD              # Plantilla de variables de entorno
│   ├── .env                # Variables reales (no versionar)
│   └── package.json        # Scripts y dependencias del backend
│
├── frontend/               # Aplicación web (React + Vite)
│   ├── src/                # Componentes, vistas y lógica
│   ├── public/             # Recursos estáticos
│   ├── Dockerfile          # Imagen del servicio frontend
│   └── .env
│
├── db/                     # Base de datos PostgreSQL
│   ├── init.sql            # Script de inicialización (estructura SGALT)
│   └── init_old.sql        # Versiones antiguas (respaldo)
│
├── docker-compose.yml       # Orquestador de servicios (backend, frontend, db)
└── README.md                # Documentación principal del proyecto
```

---

## ⚙️ Requisitos Previos

Antes de ejecutar SGALT_PT, asegúrate de tener instalado:

- 🐳 **Docker** y **Docker Compose**  
- 🟢 **Node.js v18+** (si deseas ejecutar scripts fuera de Docker)
- 📦 **npm v9+**

---

## 🚀 Puesta en Marcha

1. **Clonar el repositorio**

```bash
git clone https://github.com/FevoRenndell/sgalt_pt.git
cd sgalt_pt
```

2. **Levantar los servicios**

```bash
docker compose up -d --build
```

Esto iniciará tres contenedores:

| Servicio | Descripción | Puerto |
|-----------|--------------|--------|
| **sgalt-db** | Base de datos PostgreSQL | 5432 |
| **sgalt-backend** | API Node.js + Express | 3000 |
| **sgalt-frontend** | Aplicación React (Vite) | 5173 |

3. **Verificar que todo esté corriendo**

```bash
docker ps
```

Deberías ver los tres contenedores activos.

---

## 🧪 Probar el Backend

Abre tu navegador y visita:

```
http://localhost:3000/api/ping
```

Si todo está correcto, recibirás la respuesta:

```json
{ "message": "pong" }
```

---

## 🔐 Variables de Entorno del Backend

El archivo `backend/ENV.MD` actúa como plantilla de ejemplo para configurar el entorno (`.env` real).  
Estas variables deben estar definidas antes de construir el contenedor:

```bash
# === SGALT BACKEND ===
NODE_ENV=development
PORT=3000

# === DATABASE (PostgreSQL dentro del contenedor) ===
DB_HOST=sgalt-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sgalt

# === SEGURIDAD ===
JWT_SECRET=una_clave_segura_generada_por_ti

# === CORS (frontend permitido) ===
CORS_ORIGIN=http://localhost:5173

# === LOGS ===
LOG_LEVEL=info
```

📘 **Consejos:**
- Cambia `JWT_SECRET` por una clave segura única para producción.  
- Asegúrate de que `DB_HOST` coincida con el nombre del servicio definido en `docker-compose.yml` (`sgalt-db`).  
- Puedes renombrar `ENV.MD` a `.env.example` para indicar que es una plantilla.

---

## 🐳 Dockerfile del Backend

El archivo `backend/Dockerfile` construye la imagen del servicio API.  
Ejemplo típico de configuración:

```Dockerfile
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

Este contenedor:
- Instala las dependencias del backend.
- Copia el código fuente.
- Expone el puerto definido en `PORT`.
- Ejecuta el servidor Express usando `nodemon` (modo desarrollo).

---

## 👤 Creación y Reseteo del Usuario Administrador

El backend incluye scripts en `src/seed/` para crear o restablecer el usuario **Administrador** en la tabla `users` de PostgreSQL.

```
backend/src/seed/
├── createAdminUser.js   # Crea el usuario admin si no existe
└── resetAdminUser.js    # Elimina y recrea el usuario admin
```

### 🧩 Crear el usuario administrador

Ejecuta dentro del contenedor del backend:

```bash
docker compose exec backend npm run seed:admin
```

Este comando:
- Verifica si el rol **“Administrador”** existe; si no, lo crea.
- Inserta el usuario `admin@sgalt.cl` con contraseña cifrada (`bcryptjs`).
- Asigna el rol al usuario.
- Muestra por consola los datos del usuario creado.

**Variables configurables (en el `.env`):**

```bash
ADMIN_FIRST_NAME=Administrador
ADMIN_LAST_NAME_1=SGALT
ADMIN_LAST_NAME_2=
ADMIN_EMAIL=admin@sgalt.cl
ADMIN_PASSWORD=ChangeMe!123
ADMIN_ACTIVE=true
ADMIN_ROLE_DESCRIPTION=Administrador
BCRYPT_ROUNDS=12
```

---

### 🔄 Resetear el usuario administrador

Para eliminar y volver a crear al usuario admin desde cero:

```bash
docker compose exec backend npm run seed:reset
```

Durante la ejecución, se solicitará confirmación:

```
❗ ¿Estás seguro de que deseas eliminar y volver a crear el usuario admin? (y/n): y
🧹 Eliminando usuario admin (admin@sgalt.cl) si existe...
✅ Usuario eliminado correctamente.
🔁 Procediendo a recrear el usuario admin...
✅ Usuario administrador creado exitosamente.
```

---

## 📦 Scripts NPM del Backend

Definidos en `backend/package.json`:

```json
"scripts": {
  "dev": "nodemon src/server.js",
  "server": "nodemon src/server.js",
  "seed:admin": "node src/seed/createAdminUser.js",
  "seed:reset": "node src/seed/resetAdminUser.js"
}
```

### 🧩 Ejemplos de uso

```bash
# Modo desarrollo (reinicio automático)
docker compose exec backend npm run dev

# Crear usuario admin
docker compose exec backend npm run seed:admin

# Resetear usuario admin
docker compose exec backend npm run seed:reset
```

---

## 🗄️ Base de Datos PostgreSQL

Configuración por defecto del contenedor `sgalt-db`:

| Parámetro | Valor |
|------------|--------|
| **Host interno** | sgalt-db |
| **Puerto** | 5432 |
| **Usuario** | postgres |
| **Contraseña** | postgres |
| **Base de datos** | sgalt |

El script `db/init.sql` contiene la estructura completa del modelo SGALT, incluyendo tablas como:
- `roles`
- `users`
- `clients`
- `quotation_request`
- y otras tablas relacionadas con servicios y cotizaciones.

📘 Puedes conectarte con **DataGrip**, **pgAdmin** o **TablePlus** usando las credenciales del `.env`.

---

## 📚 Próximos pasos

- Implementar autenticación con **JWT** y middleware de seguridad.
- Integrar el frontend con la API REST del backend.
- Agregar los módulos de **cotizaciones, clientes y usuarios**.
- Configurar logs avanzados y manejo de errores.
- Desplegar en un entorno cloud (Vultr / AWS / DigitalOcean).

---

## 👨‍💻 Autor

> Desarrollado por **Cristian Reyes**  
> Proyecto **SGALT** — QALITIC SpA / GEOCONTROL  
> 🌐 [https://geocontrol.cl](https://geocontrol.cl)
