/**
 * ============================================================
 * Script: resetAdminUser.js
 * Descripción:
 * ------------------------------------------------------------
 * Este script elimina al usuario administrador (si existe)
 * y lo vuelve a crear ejecutando el script createAdminUser.js.
 *
 * Incluye confirmación interactiva para evitar borrados
 * accidentales en entornos de producción.
 *
 * Autor: Cristian Reyes
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
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "sgalt",
};

// ============================================================
// 2️⃣ Función de confirmación por consola
// ============================================================
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ============================================================
// 3️⃣ Función principal
// ============================================================
async function resetAdminUser() {
  const client = new Client(dbConfig);
  const email = "admin@sgalt.cl";

  console.log("⚙️  Iniciando proceso para restablecer usuario administrador...");
  console.log(`📧 Usuario objetivo: ${email}\n`);

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

    // ------------------------------------------------------------
    // 1️⃣ Eliminar al usuario admin si existe
    // ------------------------------------------------------------
    console.log(`🧹 Eliminando usuario admin (${email}) si existe...`);

    const deleteQuery = `
      DELETE FROM users
      WHERE email = $1
      RETURNING id, email;
    `;
    const deleteResult = await client.query(deleteQuery, [email]);

    if (deleteResult.rowCount > 0) {
      console.log(`✅ Usuario eliminado correctamente: ${deleteResult.rows[0].email}`);
    } else {
      console.log("ℹ️  No existía ningún usuario admin previo.");
    }

    // ------------------------------------------------------------
    // 2️⃣ Cerrar conexión antes de recrear
    // ------------------------------------------------------------
    await client.end();
    console.log("\n🔚 Conexión a la base de datos cerrada.");
    console.log("🔁 Procediendo a recrear el usuario admin...\n");

    // ------------------------------------------------------------
    // 3️⃣ Ejecutar el script de creación del usuario admin
    // ------------------------------------------------------------
    exec("npm run seed:admin", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error al ejecutar seed:admin: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ Advertencia: ${stderr}`);
      }
      console.log(stdout);
    });
  } catch (error) {
    console.error("❌ Error durante el proceso de restablecimiento:");
    console.error(error.message);
    await client.end();
  }
}

// Ejecutar función principal
resetAdminUser();
