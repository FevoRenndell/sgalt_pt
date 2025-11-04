/**
 * ============================================================
 * Script: createAdminUser.js
 * Descripción:
 * ------------------------------------------------------------
 * Crea (o recrea de forma idempotente) el usuario administrador
 * en la base de datos PostgreSQL del proyecto SGALT.
 *
 * Alineado con el esquema actual:
 *   - Tabla: users(id, first_name, last_name_1, last_name_2, email,
 *                  password_hash, role_id, is_active, created_at, updated_at)
 *   - Tabla: roles(id, description, created_at, updated_at)
 *
 * Flujo:
 *   1) Conexión y SET search_path (DB_SCHEMA, public)
 *   2) Upsert del rol "Administrador" (o el indicado por ADMIN_ROLE_DESCRIPTION)
 *   3) Verificación de usuario por email (case-insensitive)
 *   4) Inserción (si no existe) con password hasheado y role_id asignado
 *
 * Requiere variables de entorno (ver más abajo).
 *
 * Autor: Cristian Reyes
 * Proyecto: SGALT
 * ============================================================
 */

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Client } = pkg;

// ============================================================
// 1️⃣ Cargar variables de entorno (.env)
// ============================================================
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sgalt',
};

// Soporte de esquema (por ahora tu esquema es 'public', pero lo dejamos flexible)
const DB_SCHEMA = process.env.DB_SCHEMA || 'public';

// Datos del admin configurables por entorno
const ADMIN_FIRST_NAME = (process.env.ADMIN_FIRST_NAME || 'Administrador').trim();
const ADMIN_LAST_NAME_1 = (process.env.ADMIN_LAST_NAME_1 || 'SGALT').trim();
const ADMIN_LAST_NAME_2 = (process.env.ADMIN_LAST_NAME_2 || '').trim() || null;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@sgalt.cl').trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'admin').trim();
const ADMIN_ACTIVE = String(process.env.ADMIN_ACTIVE ?? 'true').toLowerCase() === 'true';
const ADMIN_ROLE_DESC = (process.env.ADMIN_ROLE_DESCRIPTION || 'Administrador').trim();
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

// ============================================================
// 2️⃣ Utilidades SQL
// ============================================================

/**
 * Asegura que operemos en el esquema esperado.
 */
async function setSearchPath(client, schema) {
  await client.query(`SET search_path TO ${schema}, public;`);
}

/**
 * Obtiene el id de un rol por descripción (case-insensitive).
 * Si no existe, lo crea y devuelve su id (idempotente).
 */
async function upsertRoleAndGetId(client, roleDescription) {
  // Intento de búsqueda por LOWER(description) para alinear con tu índice único
  const sel = await client.query(
    `SELECT id FROM roles WHERE LOWER(description) = LOWER($1) LIMIT 1;`,
    [roleDescription],
  );
  if (sel.rowCount > 0) return sel.rows[0].id;

  // No existe: crearlo. Como tu índice único es sobre LOWER(description),
  // si en paralelo otro proceso lo crea, este INSERT podría chocar.
  // Para robustez: capturamos la violación única y re-seleccionamos.
  try {
    const ins = await client.query(`INSERT INTO roles (description) VALUES ($1) RETURNING id;`, [
      roleDescription,
    ]);
    return ins.rows[0].id;
  } catch (e) {
    // Si ocurrió un conflicto por unicidad, volvemos a seleccionar
    const retry = await client.query(
      `SELECT id FROM roles WHERE LOWER(description) = LOWER($1) LIMIT 1;`,
      [roleDescription],
    );
    if (retry.rowCount > 0) return retry.rows[0].id;
    throw e;
  }
}

/**
 * Devuelve true si ya existe un usuario con ese email (case-insensitive).
 */
async function userExistsByEmail(client, email) {
  const { rows } = await client.query(
    `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;`,
    [email],
  );
  return rows.length > 0;
}

// ============================================================
// 3️⃣ Función principal: crear usuario admin
// ============================================================

async function createAdminUser() {
  const client = new Client(dbConfig);

  console.log('🔄 Conectando a la base de datos...');
  await client.connect();
  console.log('✅ Conexión establecida con éxito.');
  console.log(
    `🗂️  Base: ${dbConfig.database}  |  Esquema: ${DB_SCHEMA}  |  Host: ${dbConfig.host}:${dbConfig.port}\n`,
  );

  try {
    // Trabajar en el esquema indicado
    await setSearchPath(client, DB_SCHEMA);

    // Iniciamos transacción: queremos todo-o-nada
    await client.query('BEGIN');

    // 1) Asegurar rol y obtener su id
    const roleId = await upsertRoleAndGetId(client, ADMIN_ROLE_DESC);

    // 2) Verificar si el usuario ya existe por email (case-insensitive)
    const exists = await userExistsByEmail(client, ADMIN_EMAIL);
    if (exists) {
      console.log(`⚠️  El usuario admin (${ADMIN_EMAIL}) ya existe. No se crea uno nuevo.`);
      await client.query('COMMIT');
      return;
    }

    // 3) Hash de contraseña
    console.log('🔒 Encriptando contraseña...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS);

    // 4) Insertar usuario
    const insertQuery = `
      INSERT INTO users (
        first_name,
        last_name_1,
        last_name_2,
        email,
        password_hash,
        role_id,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, role_id, created_at
    `;
    const values = [
      ADMIN_FIRST_NAME,
      ADMIN_LAST_NAME_1,
      ADMIN_LAST_NAME_2,
      ADMIN_EMAIL,
      passwordHash,
      roleId,
      ADMIN_ACTIVE,
    ];

    const { rows } = await client.query(insertQuery, values);
    const user = rows[0];

    await client.query('COMMIT');

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('--------------------------------------------');
    console.log(`🆔 ID: ${user.id}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Rol (role_id): ${user.role_id}`);
    console.log(`📅 Creado en: ${user.created_at}`);
    console.log('--------------------------------------------');
  } catch (error) {
    // Ante cualquier problema, revertimos
    try {
      await client.query('ROLLBACK');
    } catch (e) {
      // No es crítico si falla el rollback, pero lo dejamos registrado
      console.warn('⚠️  Falló el ROLLBACK:', e.message);
    }
    console.error('❌ Error al crear el usuario admin:');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    // 5) Cerrar conexión
    await client.end();
    console.log('🔚 Conexión a la base de datos cerrada.');
  }
}

// ============================================================
// 4️⃣ Ejecutar la función
// ============================================================
createAdminUser();
