-- ================================================================
-- Activamos la extensión 'pgcrypto' (si no existe) para poder generar UUIDs.
-- La función gen_random_uuid() proviene de esta extensión.
-- ================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- CONFIGURACIÓN DE ZONA HORARIA LOCAL
-- ================================================================
-- Aplica automáticamente a cualquier base de datos donde se ejecute este script.
SET TIMEZONE TO 'America/Santiago';
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- TABLA DE USUARIOS DEL SISTEMA SGALT
-- ================================================================
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

-- ================================================================
-- Fin de la creación de tabla.
-- Esta estructura permite un control completo sobre la gestión de usuarios:
--   - Soporta autenticación segura (email + password_hash).
--   - Permite auditoría (timestamps).
--   - Facilita futuras integraciones (firma, avatar, roles, etc.).
-- ================================================================

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

-- ================================================================
-- FUNCIÓN DE AUDITORÍA OPTIMIZADA PARA LA TABLA 'users'
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

-- ================================================================
-- TRIGGER DE AUDITORÍA PARA 'users'
-- ================================================================
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE
ON users
FOR EACH ROW
EXECUTE FUNCTION fn_audit_users();
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- TABLA DE ÁREAS DE SERVICIO (CATEGORIZACIÓN DE ENSAYOS)
-- ================================================================
CREATE TABLE IF NOT EXISTS service_areas (
  -- Identificador numérico autoincremental único para cada área.
  id BIGSERIAL PRIMARY KEY,

  -- Identificador universal único (UUID) generado automáticamente.
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,

  -- Nombre del área o disciplina técnica (ej.: Mecánica de Suelos, Hormigón, etc.).
  name VARCHAR(150) NOT NULL,

  -- Código de acreditación asignado (ej.: LE603).
  accreditation_code VARCHAR(50),

  -- URL al documento PDF de acreditación.
  accreditation_document_url TEXT,

  -- Norma o estándar de acreditación (ej.: NCh-ISO/IEC 17025:2017).
  standard VARCHAR(100),

  -- Fecha de la primera obtención de la acreditación.
  first_accreditation_date DATE,

  -- Fecha de inicio de la vigencia actual.
  valid_from DATE,

  -- Fecha de término de la vigencia actual.
  valid_until DATE,

  -- Fecha de la última auditoría.
  last_audit_date DATE,

  -- Fecha y hora de creación del registro.
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que creó el registro.
  created_by BIGINT,

  -- Fecha y hora de la última actualización del registro.
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que realizó la última actualización.
  updated_by BIGINT,

  -- Fecha y hora de eliminación lógica (soft delete).
  deleted_at TIMESTAMPTZ,

  -- ID del usuario que marcó el registro como eliminado.
  deleted_by BIGINT
);
-- ================================================================

-- ================================================================
-- COMENTARIOS DESCRIPTIVOS DE LA TABLA 'service_areas'
-- ================================================================
COMMENT ON TABLE service_areas IS 'Contiene las áreas de servicio del laboratorio, incluyendo información de acreditación, vigencia y auditoría.';

COMMENT ON COLUMN service_areas.id IS 'Identificador numérico autoincremental único para cada área.';
COMMENT ON COLUMN service_areas.uuid IS 'Identificador universal único (UUID) generado automáticamente.';
COMMENT ON COLUMN service_areas.name IS 'Nombre del área o disciplina técnica (ej.: Mecánica de Suelos, Hormigón, etc.).';
COMMENT ON COLUMN service_areas.accreditation_code IS 'Código de acreditación asignado (ej.: LE603).';
COMMENT ON COLUMN service_areas.accreditation_document_url IS 'URL del documento PDF que contiene la acreditación.';
COMMENT ON COLUMN service_areas.standard IS 'Norma de acreditación (ej.: NCh-ISO/IEC 17025:2017).';
COMMENT ON COLUMN service_areas.first_accreditation_date IS 'Fecha en que se obtuvo por primera vez la acreditación.';
COMMENT ON COLUMN service_areas.valid_from IS 'Fecha de inicio de vigencia de la acreditación.';
COMMENT ON COLUMN service_areas.valid_until IS 'Fecha de término de vigencia de la acreditación.';
COMMENT ON COLUMN service_areas.last_audit_date IS 'Fecha en que se realizó la última auditoría del área.';
COMMENT ON COLUMN service_areas.created_at IS 'Fecha y hora de creación del registro.';
COMMENT ON COLUMN service_areas.created_by IS 'ID del usuario que creó el registro.';
COMMENT ON COLUMN service_areas.updated_at IS 'Fecha y hora de la última actualización del registro.';
COMMENT ON COLUMN service_areas.updated_by IS 'ID del usuario que actualizó el registro.';
COMMENT ON COLUMN service_areas.deleted_at IS 'Fecha y hora de eliminación lógica (soft delete).';
COMMENT ON COLUMN service_areas.deleted_by IS 'ID del usuario que marcó el registro como eliminado (soft delete).';
-- ================================================================

-- ================================================================
-- RELACIONES CON LA TABLA 'users'
-- ================================================================
ALTER TABLE service_areas
  ADD CONSTRAINT fk_service_areas_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_service_areas_updated_by
    FOREIGN KEY (updated_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_service_areas_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL;
-- ================================================================

-- ================================================================
-- NOTA:
-- Esta tabla está preparada para integrarse con la tabla 'services'
-- mediante el campo 'area_id', permitiendo organizar los ensayos
-- por área técnica (ej.: Suelos, Asfaltos, Hormigones, etc.).
-- ================================================================

-- ================================================================
-- TABLA DE AUDITORÍA PARA 'service_areas'
-- ================================================================
CREATE TABLE IF NOT EXISTS service_areas_audit (
  -- Identificador único del registro de auditoría.
  id BIGSERIAL PRIMARY KEY,

  -- ID del área afectada.
  service_area_id BIGINT NOT NULL,

  -- Tipo de acción: INSERT, UPDATE o DELETE.
  action VARCHAR(10) NOT NULL,

  -- ID del usuario que realizó la acción.
  changed_by BIGINT,

  -- Fecha y hora exacta en que se produjo el evento.
  changed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Datos anteriores al cambio (para UPDATE/DELETE).
  old_data JSONB,

  -- Datos nuevos (para INSERT/UPDATE).
  new_data JSONB,

  -- Campos que fueron modificados (solo para UPDATE).
  changed_fields JSONB,

  -- Relación con la tabla principal.
  CONSTRAINT fk_service_areas_audit_area
    FOREIGN KEY (service_area_id) REFERENCES service_areas (id)
    ON DELETE CASCADE
);
-- ================================================================

-- ================================================================
-- FUNCIÓN DE AUDITORÍA PARA LA TABLA 'service_areas'
-- ================================================================
CREATE OR REPLACE FUNCTION fn_audit_service_areas()
RETURNS TRIGGER AS $$
DECLARE
  diffs JSONB := '{}';
  column_name TEXT;
BEGIN
  -- 🔹 Evento de INSERCIÓN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO service_areas_audit (service_area_id, action, changed_by, new_data)
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
      WHERE table_name = 'service_areas'
        AND column_name NOT IN (
          'created_at', 'created_by',
          'updated_at', 'updated_by',
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

    -- Solo registrar si existen cambios relevantes
    IF jsonb_object_length(diffs) = 0 THEN
      RETURN NEW;
    END IF;

    INSERT INTO service_areas_audit (service_area_id, action, changed_by, old_data, new_data, changed_fields)
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
    INSERT INTO service_areas_audit (service_area_id, action, changed_by, old_data)
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

-- ================================================================
-- TRIGGER DE AUDITORÍA PARA 'service_areas'
-- ================================================================
CREATE TRIGGER trg_audit_service_areas
AFTER INSERT OR UPDATE OR DELETE
ON service_areas
FOR EACH ROW
EXECUTE FUNCTION fn_audit_service_areas();
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- TABLA DE SERVICIOS DEL LABORATORIO (CATÁLOGO DE ENSAYOS)
-- ================================================================
CREATE TABLE IF NOT EXISTS services (
  -- Identificador numérico autoincremental único para cada servicio.
  id BIGSERIAL PRIMARY KEY,

  -- Identificador universal único (UUID) generado automáticamente.
  uuid UUID DEFAULT gen_random_uuid() UNIQUE,

  -- Nombre completo del servicio.
  name VARCHAR(255) NOT NULL,

  -- ID del área de servicio (referencia futura a tabla areas_servicio).
  area_id BIGINT,

  -- Norma técnica o de ensayo (por ejemplo: ISO, NCh, MC, etc.).
  test_standard VARCHAR(100),

  -- Unidad de venta (ej.: cada muestra, cada hora, etc.).
  unit VARCHAR(50),

  -- Código interno de la ficha del servicio.
  record_code VARCHAR(50),

  -- Notas o comentarios adicionales.
  notes TEXT,

  -- Indica si el servicio se realiza en terreno (TRUE) o en laboratorio (FALSE).
  is_field_service BOOLEAN DEFAULT FALSE,

  -- Indica si el servicio está acreditado (TRUE/FALSE).
  is_accredited BOOLEAN DEFAULT FALSE,

  -- Fecha y hora de creación del servicio.
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que creó el registro.
  created_by BIGINT,

  -- Fecha y hora de la última actualización del servicio.
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- ID del usuario que realizó la última actualización.
  updated_by BIGINT,

  -- Fecha y hora de eliminación lógica (soft delete).
  deleted_at TIMESTAMPTZ,

  -- ID del usuario que marcó el registro como eliminado (soft delete).
  deleted_by BIGINT
);
-- ================================================================

-- ================================================================
-- COMENTARIOS DESCRIPTIVOS DE LA TABLA 'services'
-- ================================================================
COMMENT ON TABLE services IS 'Catálogo de servicios de laboratorio. Contiene los ensayos o productos ofrecidos por el laboratorio.';

COMMENT ON COLUMN services.id IS 'Identificador numérico autoincremental único para cada servicio.';
COMMENT ON COLUMN services.uuid IS 'Identificador universal único (UUID) del servicio.';
COMMENT ON COLUMN services.name IS 'Nombre completo del servicio o ensayo técnico.';
COMMENT ON COLUMN services.area_id IS 'Identificador del área a la que pertenece el servicio (Suelo, Hormigón, Asfalto, etc.).';
COMMENT ON COLUMN services.test_standard IS 'Norma de ensayo asociada al servicio (ISO, NCh, MC, etc.).';
COMMENT ON COLUMN services.unit IS 'Unidad de venta o medida del servicio (cada uno, cada muestra, etc.).';
COMMENT ON COLUMN services.record_code IS 'Código interno único asociado a la ficha del servicio.';
COMMENT ON COLUMN services.notes IS 'Espacio para anotaciones internas o detalles adicionales.';
COMMENT ON COLUMN services.is_field_service IS 'Indica si el servicio se realiza en terreno (TRUE) o en laboratorio (FALSE).';
COMMENT ON COLUMN services.is_accredited IS 'Indica si el servicio está acreditado por algún organismo técnico.';
COMMENT ON COLUMN services.created_at IS 'Fecha y hora en que se creó el registro del servicio.';
COMMENT ON COLUMN services.created_by IS 'ID del usuario que creó el registro.';
COMMENT ON COLUMN services.updated_at IS 'Fecha y hora de la última actualización del registro.';
COMMENT ON COLUMN services.updated_by IS 'ID del usuario que realizó la última actualización del registro.';
COMMENT ON COLUMN services.deleted_at IS 'Fecha y hora en que el servicio fue eliminado lógicamente (NULL = activo).';
COMMENT ON COLUMN services.deleted_by IS 'ID del usuario que marcó el registro como eliminado (soft delete).';
-- ================================================================

-- ================================================================
-- RELACIONES CON LA TABLA 'users'
-- ================================================================
ALTER TABLE services
  ADD CONSTRAINT fk_services_created_by
    FOREIGN KEY (created_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_services_updated_by
    FOREIGN KEY (updated_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT fk_services_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL;
-- ================================================================

-- ================================================================
-- RELACIONES CON LA TABLA 'service_areas'
-- ================================================================
ALTER TABLE services
  ADD CONSTRAINT fk_services_area
    FOREIGN KEY (area_id) REFERENCES service_areas (id)
    ON UPDATE CASCADE ON DELETE SET NULL;
-- ================================================================

-- ================================================================
-- TABLA DE AUDITORÍA PARA 'services'
-- ================================================================
CREATE TABLE IF NOT EXISTS services_audit (
  -- Identificador único del registro de auditoría.
  id BIGSERIAL PRIMARY KEY,

  -- ID del servicio afectado.
  service_id BIGINT NOT NULL,

  -- Tipo de acción registrada: INSERT, UPDATE o DELETE.
  action VARCHAR(10) NOT NULL,

  -- ID del usuario que realizó la acción.
  changed_by BIGINT,

  -- Fecha y hora exacta en que ocurrió el evento.
  changed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Datos anteriores al cambio (para UPDATE/DELETE).
  old_data JSONB,

  -- Datos nuevos (para INSERT/UPDATE).
  new_data JSONB,

  -- Campos que fueron modificados (solo para UPDATE).
  changed_fields JSONB,

  -- Relación con el servicio afectado.
  CONSTRAINT fk_services_audit_service
    FOREIGN KEY (service_id) REFERENCES services (id)
    ON DELETE CASCADE
);
-- ================================================================

-- ================================================================
-- FUNCIÓN DE AUDITORÍA PARA LA TABLA 'services'
-- ================================================================
CREATE OR REPLACE FUNCTION fn_audit_services()
RETURNS TRIGGER AS $$
DECLARE
  diffs JSONB := '{}';
  column_name TEXT;
BEGIN
  -- 🔹 Evento de INSERCIÓN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO services_audit (service_id, action, changed_by, new_data)
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
    -- Detectar columnas modificadas (excluyendo las de auditoría)
    FOR column_name IN
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'services'
        AND column_name NOT IN (
          'created_at', 'created_by',
          'updated_at', 'updated_by',
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

    -- Solo registrar si existen cambios relevantes
    IF jsonb_object_length(diffs) = 0 THEN
      RETURN NEW;
    END IF;

    INSERT INTO services_audit (service_id, action, changed_by, old_data, new_data, changed_fields)
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
    INSERT INTO services_audit (service_id, action, changed_by, old_data)
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

-- ================================================================
-- TRIGGER DE AUDITORÍA PARA 'services'
-- ================================================================
CREATE TRIGGER trg_audit_services
AFTER INSERT OR UPDATE OR DELETE
ON services
FOR EACH ROW
EXECUTE FUNCTION fn_audit_services();
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- 👁️ VISTA CONSOLIDADA DE AUDITORÍA DEL SISTEMA (vw_audit_log)
-- ================================================================
CREATE OR REPLACE VIEW vw_audit_log AS
SELECT
  'users' AS entity,
  ua.user_id AS record_id,
  ua.action,
  ua.changed_by,
  CONCAT_WS(' ',
    u.first_name,
    u.last_name_1,
    COALESCE(u.last_name_2, '')
  ) AS changed_by_name,
  u.email AS changed_by_email,
  ua.changed_at,
  ua.changed_fields,
  ua.old_data,
  ua.new_data
FROM users_audit ua
LEFT JOIN users u ON ua.changed_by = u.id

UNION ALL

SELECT
  'service_areas' AS entity,
  saa.service_area_id AS record_id,
  saa.action,
  saa.changed_by,
  CONCAT_WS(' ',
    u.first_name,
    u.last_name_1,
    COALESCE(u.last_name_2, '')
  ) AS changed_by_name,
  u.email AS changed_by_email,
  saa.changed_at,
  saa.changed_fields,
  saa.old_data,
  saa.new_data
FROM service_areas_audit saa
LEFT JOIN users u ON saa.changed_by = u.id

UNION ALL

SELECT
  'services' AS entity,
  sa.service_id AS record_id,
  sa.action,
  sa.changed_by,
  CONCAT_WS(' ',
    u.first_name,
    u.last_name_1,
    COALESCE(u.last_name_2, '')
  ) AS changed_by_name,
  u.email AS changed_by_email,
  sa.changed_at,
  sa.changed_fields,
  sa.old_data,
  sa.new_data
FROM services_audit sa
LEFT JOIN users u ON sa.changed_by = u.id;

-- ================================================================
-- DESCRIPCIÓN DE LA VISTA 'vw_audit_log'
-- ================================================================
COMMENT ON VIEW vw_audit_log IS
  'Vista consolidada de auditoría del sistema SGALT. Unifica los registros de auditoría de las tablas users, service_areas y services, incluyendo el nombre completo y correo del usuario que realizó cada acción.';
-- ================================================================

-- ================================================================
-- EJECUTAR EN CLIENTE SQL PARA VER LA VISTA 'vw_audit_log'
-- ================================================================
-- SELECT entity, action, changed_by_name, changed_by_email, changed_at
-- FROM vw_audit_log
-- ORDER BY changed_at DESC;
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================
-- VISTA DE ACTIVIDAD POR USUARIO (vw_user_activity_log)
-- ================================================================
CREATE OR REPLACE VIEW vw_user_activity_log AS
SELECT
  a.changed_by,
  a.changed_by_name,
  a.changed_by_email,
  a.entity,
  a.record_id,
  a.action,
  a.changed_at,
  a.changed_fields,
  a.old_data,
  a.new_data
FROM vw_audit_log a
WHERE a.changed_by IS NOT NULL;

-- ================================================================
-- 🏷️ DESCRIPCIÓN DE LA VISTA 'vw_user_activity_log'
-- ================================================================
COMMENT ON VIEW vw_user_activity_log IS
  'Vista que consolida todas las acciones realizadas por cada usuario en el sistema SGALT. Permite analizar la actividad individual de los usuarios en todas las entidades auditadas (users, service_areas y services).';
-- ================================================================

-- ================================================================
-- EJECUTAR EN CLIENTE SQL PARA VER LA VISTA 'vw_user_activity_log'
-- ================================================================
-- ================================================================
-- Consultar toda la actividad de un usuario.
-- ================================================================
-- SELECT *
-- FROM vw_user_activity_log
-- WHERE changed_by = 1
-- ORDER BY changed_at DESC;
-- ================================================================
-- (donde 1 es el ID del usuario en la tabla users)
-- ================================================================
-- ================================================================
-- Buscar por correo electrónico del usuario
-- ================================================================
-- SELECT *
-- FROM vw_user_activity_log
-- WHERE changed_by_email = 'admin@geocontrol.cl'
-- ORDER BY changed_at DESC;
-- ================================================================
-- ================================================================
-- Ver resumen general por tipo de acción
-- ================================================================
-- SELECT
--   changed_by_name,
--   COUNT(*) FILTER (WHERE action = 'INSERT') AS inserts,
--   COUNT(*) FILTER (WHERE action = 'UPDATE') AS updates,
--   COUNT(*) FILTER (WHERE action = 'DELETE') AS deletes
-- FROM vw_user_activity_log
-- GROUP BY changed_by_name
-- ORDER BY inserts DESC;
-- ================================================================



-- ################################################################
-- ################################################################
-- ################################################################



-- ================================================================