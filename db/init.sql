-- Activamos la extensión 'pgcrypto' (si no existe) para poder generar UUIDs.
-- La función gen_random_uuid() proviene de esta extensión.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- CONFIGURACIÓN DE ZONA HORARIA LOCAL
-- ================================================================
-- Aplica automáticamente a cualquier base de datos donde se ejecute este script.
SET TIMEZONE TO 'America/Santiago';

-- Creación de la tabla principal de usuarios del sistema.
CREATE TABLE IF NOT EXISTS users (
  -- Identificador numérico autoincremental único para cada usuario.
  id BIGSERIAL PRIMARY KEY,

  -- Identificador universal único (UUID) generado automáticamente.
  -- Se usa para operaciones donde no se debe exponer el ID incremental.
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,

  -- Nombre del usuario.
  first_name VARCHAR(100) NOT NULL,

  -- Primer apellido (obligatorio).
  last_name_1 VARCHAR(100) NOT NULL,

  -- Segundo apellido (opcional).
  last_name_2 VARCHAR(100),

  -- Iniciales del usuario (por ejemplo: "C.R.R.").
  initials VARCHAR(10),

  -- Cargo o puesto que ocupa dentro de la organización.
  position VARCHAR(100),

  -- URL a la imagen de la firma digital (por ejemplo: imagen .png o .jpg almacenada en S3 u Object Storage).
  signature_url TEXT,

  -- URL al avatar o foto del usuario.
  avatar_url TEXT,

  -- Correo electrónico único del usuario, también se usa como nombre de usuario para autenticación.
  email VARCHAR(255) UNIQUE NOT NULL,

  -- Contraseña del usuario almacenada de forma segura con hash (por ejemplo, bcrypt).
  password_hash VARCHAR(255) NOT NULL,

  -- Número de teléfono (puede incluir código de país).
  phone_number VARCHAR(20),

  -- Indica si el usuario tiene privilegios administrativos dentro del sistema.
  is_admin BOOLEAN DEFAULT FALSE,

  -- Indica si el usuario está activo (TRUE = puede acceder, FALSE = cuenta deshabilitada).
  is_active BOOLEAN DEFAULT TRUE,

  -- Fecha y hora del último inicio de sesión exitoso.
  last_login_at TIMESTAMPTZ,

  -- Fecha y hora en la que el usuario solicitó restablecer su contraseña.
  password_reset_requested_at TIMESTAMPTZ,

  -- Fecha y hora en la que se creó el registro del usuario.
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que creó este registro.
  created_by BIGINT,

  -- Fecha y hora de la última actualización del registro.
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que realizó la última actualización del registro.
  updated_by BIGINT,

  -- Fecha y hora de eliminación lógica (soft delete). NULL significa que el usuario sigue activo.
  deleted_at TIMESTAMPTZ,

  -- ID del usuario que marcó el registro como eliminado (soft delete)
  deleted_by BIGINT
);

-- ================================================================
-- COMENTARIOS DESCRIPTIVOS EN LAS COLUMNAS (PERSISTEN EN EL MOTOR)
-- ================================================================

COMMENT ON TABLE users IS 'Tabla que almacena todos los usuarios registrados en el sistema SGALT. Incluye información personal, de autenticación, privilegios y auditoría.';

COMMENT ON COLUMN users.id IS 'Identificador numérico autoincremental único para cada usuario.';
COMMENT ON COLUMN users.uuid IS 'UUID generado automáticamente para evitar exposición del ID incremental.';
COMMENT ON COLUMN users.first_name IS 'Nombre del usuario.';
COMMENT ON COLUMN users.last_name_1 IS 'Primer apellido del usuario (obligatorio).';
COMMENT ON COLUMN users.last_name_2 IS 'Segundo apellido del usuario (opcional).';
COMMENT ON COLUMN users.initials IS 'Iniciales del usuario (por ejemplo: C.R.R.).';
COMMENT ON COLUMN users.position IS 'Cargo o puesto del usuario dentro de la organización.';
COMMENT ON COLUMN users.signature_url IS 'URL de la firma digital (PNG) del usuario.';
COMMENT ON COLUMN users.avatar_url IS 'URL de la foto o avatar del usuario.';
COMMENT ON COLUMN users.email IS 'Correo electrónico único, usado como nombre de usuario para autenticación.';
COMMENT ON COLUMN users.password_hash IS 'Hash de la contraseña (por ejemplo, generado con bcrypt).';
COMMENT ON COLUMN users.phone_number IS 'Número de teléfono asociado al usuario.';
COMMENT ON COLUMN users.is_admin IS 'Indica si el usuario tiene privilegios administrativos.';
COMMENT ON COLUMN users.is_active IS 'Indica si la cuenta del usuario está activa (TRUE = puede acceder).';
COMMENT ON COLUMN users.last_login_at IS 'Fecha y hora del último inicio de sesión exitoso.';
COMMENT ON COLUMN users.password_reset_requested_at IS 'Fecha y hora de la última solicitud de restablecimiento de contraseña.';
COMMENT ON COLUMN users.created_at IS 'Fecha y hora de creación del registro del usuario.';
COMMENT ON COLUMN users.created_by IS 'ID del usuario que creó este registro. Permite rastrear quién dio de alta al usuario.';
COMMENT ON COLUMN users.updated_at IS 'Fecha y hora de la última actualización del registro.';
COMMENT ON COLUMN users.updated_by IS 'ID del usuario que realizó la última actualización del registro. Se actualiza automáticamente desde el backend.';
COMMENT ON COLUMN users.deleted_at IS 'Fecha y hora de eliminación lógica del usuario (NULL = activo).';
COMMENT ON COLUMN users.deleted_by IS 'ID del usuario que marcó este registro como eliminado (soft delete). Permite identificar quién ejecutó la baja.';

-- ================================================================

-- Fin de la creación de tabla.
-- Esta estructura permite un control completo sobre la gestión de usuarios:
--   - Soporta autenticación segura (email + password_hash).
--   - Permite auditoría (timestamps).
--   - Facilita futuras integraciones (firma, avatar, roles, etc.).

-- ================================================================
-- RELACIONES AUTO-REFERENCIALES PARA AUDITORÍA DE AUTORÍA Y MODIFICACIONES
-- ================================================================
-- Estas claves foráneas garantizan que los campos created_by, updated_by y deleted_by
-- siempre apunten a usuarios válidos existentes dentro de la misma tabla 'users'.

ALTER TABLE users
  ADD CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_users_updated_by
    FOREIGN KEY (updated_by) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_users_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

-- ================================================================
-- NOTA:
-- Se utiliza ON DELETE SET NULL para evitar eliminaciones en cascada,
-- conservando la trazabilidad de registros incluso si el usuario original
-- que creó o modificó un registro fue eliminado del sistema.
-- ================================================================



-- ================================================================
-- TABLA DE AUDITORÍA PARA 'users'
-- ================================================================
CREATE TABLE IF NOT EXISTS users_audit (
  id BIGSERIAL PRIMARY KEY,                  -- Identificador único del registro de auditoría
  user_id BIGINT NOT NULL,                   -- ID del usuario afectado
  action VARCHAR(10) NOT NULL,               -- Acción realizada: INSERT, UPDATE o DELETE
  changed_by BIGINT,                         -- ID del usuario que ejecutó la acción (si está disponible)
  changed_at TIMESTAMPTZ DEFAULT NOW(),      -- Fecha y hora en que ocurrió la acción
  old_data JSONB,                            -- Datos anteriores al cambio (para UPDATE/DELETE)
  new_data JSONB,                            -- Datos nuevos (para INSERT/UPDATE)
  changed_fields JSONB,                      -- Campos que fueron modificados (solo para UPDATE)
  CONSTRAINT fk_users_audit_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
);

-- ================================================================
-- ⚙️ FUNCIÓN DE AUDITORÍA OPTIMIZADA PARA LA TABLA 'users'
-- ================================================================
-- Esta versión ignora cambios en columnas de auditoría como:
-- updated_at, updated_by, created_at, created_by, deleted_at, deleted_by.
-- Esto evita generar registros triviales en 'changed_fields' cuando el único
-- cambio proviene de los propios mecanismos de control.

CREATE OR REPLACE FUNCTION fn_audit_users()
RETURNS TRIGGER AS $$
DECLARE
  diffs JSONB := '{}';
  column_name TEXT;
BEGIN
  -- 🔹 Evento de INSERCIÓN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO users_audit (user_id, action, changed_by, new_data)
    VALUES (
      NEW.id,
      TG_OP,
      NEW.created_by,
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;

  -- 🔹 Evento de ACTUALIZACIÓN
  IF (TG_OP = 'UPDATE') THEN
    -- Detectar qué columnas fueron modificadas (ignorando campos de auditoría)
    FOR column_name IN
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name NOT IN (
          'updated_at', 'updated_by',
          'created_at', 'created_by',
          'deleted_at', 'deleted_by'
        )
    LOOP
      IF (OLD.*)::jsonb ->> column_name IS DISTINCT FROM (NEW.*)::jsonb ->> column_name THEN
        diffs := jsonb_set(
          diffs,
          ARRAY[column_name],
          jsonb_build_object(
            'old', (OLD.*)::jsonb -> column_name,
            'new', (NEW.*)::jsonb -> column_name
          )
        );
      END IF;
    END LOOP;

    -- Solo registrar si realmente hay cambios relevantes
    IF jsonb_typeof(diffs) = 'object' AND jsonb_array_length(jsonb_object_keys(diffs)::jsonb[]) IS NULL THEN
      -- No hay cambios relevantes, no se inserta registro
      RETURN NEW;
    END IF;

    INSERT INTO users_audit (user_id, action, changed_by, old_data, new_data, changed_fields)
    VALUES (
      NEW.id,
      TG_OP,
      NEW.updated_by,
      to_jsonb(OLD),
      to_jsonb(NEW),
      diffs
    );
    RETURN NEW;
  END IF;

  -- 🔹 Evento de ELIMINACIÓN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO users_audit (user_id, action, changed_by, old_data)
    VALUES (
      OLD.id,
      TG_OP,
      OLD.deleted_by,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- TRIGGER DE AUDITORÍA PARA 'users'
-- ================================================================
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE
ON users
FOR EACH ROW
EXECUTE FUNCTION fn_audit_users();

