# === SGALT BACKEND ===
NODE_ENV=development
PORT=3000

# === DATABASE (PostgreSQL dentro del contenedor) ===
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sgalt

# === SEGURIDAD ===
JWT_SECRET=tu_clave_secreta_segura

# === CORS (frontend que puede acceder al backend) ===
CORS_ORIGIN=http://localhost:5173

# === LOGS ===
LOG_LEVEL=info
