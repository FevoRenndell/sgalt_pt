/**
 * ============================================================
 * Script: createAdminUser.js
 * Descripción:
 * ------------------------------------------------------------
 * Este script crea un usuario administrador (admin) en la base
 * de datos PostgreSQL del proyecto SGALT. Está diseñado para
 * ejecutarse de forma manual o automática cuando el sistema
 * necesita un usuario inicial de administración.
 *
 * Base de datos objetivo: sgalt
 * Tabla objetivo: users
 *
 * Autor: Cristian Reyes
 * Proyecto: SGALT
 * ============================================================
 */

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pkg from "pg";

const { Client } = pkg; // Cliente PostgreSQL nativo de Node.js

// ============================================================
// 1️⃣ Cargar variables de entorno (.env)
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
// 2️⃣ Función principal para crear usuario admin
// ============================================================

async function createAdminUser() {
  const client = new Client(dbConfig);

  try {
    console.log("🔄 Conectando a la base de datos...");
    await client.connect();
    console.log("✅ Conexión establecida con éxito.");

    // ------------------------------------------------------------
    // a) Datos del usuario administrador
    // ------------------------------------------------------------
    const adminData = {
      first_name: "Administrador",
      last_name_1: "SGALT",
      last_name_2: null,
      initials: "ADM",
      position: "Administrador General",
      email: "admin@sgalt.cl",
      password: "admin", // Se encriptará antes de insertarse
      is_admin: true,
      is_active: true,
    };

    // ------------------------------------------------------------
    // b) Verificar si ya existe el usuario admin
    // ------------------------------------------------------------
    const checkQuery = `
      SELECT id, email 
      FROM users 
      WHERE email = $1;
    `;
    const checkResult = await client.query(checkQuery, [adminData.email]);

    if (checkResult.rows.length > 0) {
      console.log("⚠️  El usuario admin ya existe en la base de datos.");
      return;
    }

    // ------------------------------------------------------------
    // c) Encriptar la contraseña usando bcrypt
    // ------------------------------------------------------------
    console.log("🔒 Encriptando contraseña...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // ------------------------------------------------------------
    // d) Insertar el usuario admin
    // ------------------------------------------------------------
    const insertQuery = `
      INSERT INTO users (
        first_name,
        last_name_1,
        last_name_2,
        initials,
        position,
        email,
        password_hash,
        is_admin,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, uuid, email, created_at;
    `;

    const values = [
      adminData.first_name,
      adminData.last_name_1,
      adminData.last_name_2,
      adminData.initials,
      adminData.position,
      adminData.email,
      hashedPassword,
      adminData.is_admin,
      adminData.is_active,
    ];

    const result = await client.query(insertQuery, values);
    const user = result.rows[0];

    console.log("✅ Usuario administrador creado exitosamente:");
    console.log("--------------------------------------------");
    console.log(`🆔 ID: ${user.id}`);
    console.log(`🔑 UUID: ${user.uuid}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`📅 Creado en: ${user.created_at}`);
    console.log("--------------------------------------------");

  } catch (error) {
    console.error("❌ Error al crear el usuario admin:");
    console.error(error.message);
  } finally {
    // ------------------------------------------------------------
    // e) Cerrar conexión
    // ------------------------------------------------------------
    await client.end();
    console.log("🔚 Conexión a la base de datos cerrada.");
  }
}

// ============================================================
// 3️⃣ Ejecutar la función
// ============================================================

createAdminUser();
