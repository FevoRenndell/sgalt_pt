/**
 * ============================================================
 * Script: resetAdminUser.js
 * Descripción:
 * ------------------------------------------------------------
 * Elimina al usuario administrador (si existe) y luego ejecuta
 * el script de creación (npm run seed:admin).
 *
 * ⚠️ Mantiene el MISMO flujo que tenías:
 *    1) Confirmación por consola
 *    2) Conexión a DB
 *    3) DELETE del admin (case-insensitive)
 *    4) Cierre de conexión
 *    5) exec("npm run seed:admin")
 *
 * Mejoras clave:
 *  - Soporta esquema vía DB_SCHEMA (SET search_path).
 *  - Email del admin configurable por env (ADMIN_EMAIL) con
 *    fallback a "admin@sgalt.cl".
 *  - Borrado case-insensitive (alineado a índice UNIQUE por LOWER(email)).
 *  - Transacción explícita para el DELETE (BEGIN/COMMIT/ROLLBACK).
 *  - Mensajes de estado más claros (muestran DB y esquema).
 *  - Validaciones mínimas de existencia de tablas/columnas.
 *
 * Autor original: Cristian Reyes
 * Proyecto: SGALT
 * ============================================================
 */

import dotenv from "dotenv";
import pkg from "pg";
import readline from "readline";
import { exec } from "child_process";

const { Client } = pkg;

// ============================================================
// 1️⃣ Cargar variables de entorno
// ============================================================
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "sgalt",
};

// Esquema (por si en el futuro usas otro distinto a 'public')
const DB_SCHEMA = process.env.DB_SCHEMA || "public";

// Email de admin configurable; mantiene tu valor por defecto
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@sgalt.cl").trim();

// ============================================================
// 2️⃣ Utilidades
// ============================================================
function askConfirmation(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// SET search_path para operar sin prefijos en el esquema elegido
async function setSearchPath(client, schema) {
  await client.query(`SET search_path TO ${schema}, public;`);
}

// Comprueba existencia de tabla y columna (defensivo, no invasivo)
async function assertUsersTableShape(client) {
  const tableQ = `
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = $1 AND table_name = 'users'
    LIMIT 1
  `;
  const colQ = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = 'users'
      AND column_name IN ('email')
  `;
  const t = await client.query(tableQ, [DB_SCHEMA]);
  if (t.rowCount === 0) {
    throw new Error(`No existe la tabla ${DB_SCHEMA}.users. Verifica tu init.sql y el esquema.`);
  }
  const c = await client.query(colQ, [DB_SCHEMA]);
  const hasEmail = c.rows.some((r) => r.column_name === "email");
  if (!hasEmail) {
    throw new Error(`La tabla ${DB_SCHEMA}.users no posee columna "email".`);
  }
}

// ============================================================
// 3️⃣ Función principal (NO cambiar nombre ni flujo)
// ============================================================
async function resetAdminUser() {
  const client = new Client(dbConfig);

  console.log("⚙️  Iniciando proceso para restablecer usuario administrador...");
  console.log(`📧 Usuario objetivo: ${ADMIN_EMAIL}`);
  console.log(`🗂️  Base: ${dbConfig.database}  |  Esquema: ${DB_SCHEMA}  |  Host: ${dbConfig.host}:${dbConfig.port}\n`);

  // ------------------------------------------------------------
  // Confirmar con el usuario antes de proceder
  // ------------------------------------------------------------
  const answer = await askConfirmation(
    "❗ ¿Estás seguro de que deseas eliminar y volver a crear el usuario admin? (y/n): "
  );
  if (answer !== "y" && answer !== "yes") {
    console.log("\n🚫 Operación cancelada por el usuario. No se realizaron cambios.");
    process.exit(0);
  }

  try {
    console.log("\n🔄 Conectando a la base de datos...");
    await client.connect();
    console.log("✅ Conexión establecida con éxito.\n");

    // Asegura que operamos sobre el esquema correcto
    await setSearchPath(client, DB_SCHEMA);

    // Validaciones mínimas (no intrusivas)
    await assertUsersTableShape(client);

    // ------------------------------------------------------------
    // 1️⃣ Eliminar al usuario admin si existe (case-insensitive)
    //     Nota: usamos LOWER(email) para alinearnos con el índice UNIQUE por LOWER(email)
    // ------------------------------------------------------------
    console.log(`🧹 Eliminando usuario admin (${ADMIN_EMAIL}) si existe...`);

    await client.query("BEGIN");
    const preview = await client.query(
      `SELECT id, email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [ADMIN_EMAIL]
    );

    if (preview.rowCount > 0) {
      const deleteQuery = `
        DELETE FROM users
        WHERE LOWER(email) = LOWER($1)
        RETURNING id, email
      `;
      const deleteResult = await client.query(deleteQuery, [ADMIN_EMAIL]);
      console.log(`✅ Usuario eliminado: ${deleteResult.rows[0].email} (id=${deleteResult.rows[0].id})`);
    } else {
      console.log("ℹ️  No existía ningún usuario admin previo.");
    }
    await client.query("COMMIT");

    // ------------------------------------------------------------
    // 2️⃣ Cerrar conexión antes de recrear
    // ------------------------------------------------------------
    await client.end();
    console.log("\n🔚 Conexión a la base de datos cerrada.");
    console.log("🔁 Procediendo a recrear el usuario admin...\n");

    // ------------------------------------------------------------
    // 3️⃣ Ejecutar el script de creación del usuario admin
    // ------------------------------------------------------------
    // Conserva el mismo mecanismo que tenías (npm run seed:admin)
    exec("npm run seed:admin", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error al ejecutar seed:admin: ${error.message}`);
        return;
      }
      if (stderr) {
        // Algunos paquetes escriben warnings en stderr sin ser error fatal
        console.error(`⚠️ Advertencia: ${stderr}`);
      }
      console.log(stdout);
    });

  } catch (error) {
    // Asegura rollback si la transacción estaba abierta
    try { await client.query("ROLLBACK"); } catch (_) {}
    console.error("❌ Error durante el proceso de restablecimiento:");
    console.error(error.message);
    try { await client.end(); } catch (_) {}
    process.exitCode = 1;
  }
}

// Ejecutar función principal
resetAdminUser();
