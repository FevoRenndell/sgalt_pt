
BEGIN;

DROP TABLE IF EXISTS quotation_items CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS quotation_request CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS communes CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_status CASCADE;
DROP TABLE IF EXISTS notification_message_type CASCADE;
DROP TABLE IF EXISTS notification_entity_type CASCADE;
-- Crea la tabla de regiones administrativas del país (nivel 1)
CREATE TABLE IF NOT EXISTS regions (            -- Si no existe, la crea; evita error en re-ejecuciones
  id            INTEGER PRIMARY KEY,  -- PK entera autoincremental moderna (IDENTITY)
  name          VARCHAR(100) NOT NULL,          -- Nombre de la región; obligatorio
  created_at    TIMESTAMP DEFAULT NOW(),        -- Marca de creación con valor por defecto actual
  updated_at    TIMESTAMP DEFAULT NOW()         -- Marca de última actualización (se actualizará vía trigger)
);

-- Índice único por nombre en minúsculas para evitar duplicados "Región X" vs "región x"
CREATE UNIQUE INDEX IF NOT EXISTS ux_regions_name ON regions (LOWER(name));
-- ^ El uso de LOWER garantiza unicidad case-insensitive.

-- Crea la tabla de ciudades (nivel 2), hija de regions
CREATE TABLE IF NOT EXISTS cities (             -- Catálogo de ciudades
  id            INTEGER PRIMARY KEY,  -- PK autoincremental
  name          VARCHAR(100) NOT NULL,          -- Nombre de la ciudad; obligatorio
  region_id     INTEGER NOT NULL,               -- FK a regions.id; cada ciudad pertenece a una región
  created_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp creación
  updated_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp actualización
  CONSTRAINT fk_cities_region                    -- Nombre explícito para la FK (buenas prácticas)
    FOREIGN KEY (region_id)                     -- Columna local que referencia
    REFERENCES regions(id)                      -- Tabla/columna remota
    ON UPDATE CASCADE ON DELETE RESTRICT        -- Si cambia id de región se propaga; no permite borrar región con ciudades
);

-- Índice único compuesto (region_id + nombre normalizado)
-- Evita tener dos "Santiago" en la MISMA región, pero permite "Santiago" en otra región si aplica
CREATE UNIQUE INDEX IF NOT EXISTS ux_cities_region_name ON cities (region_id, LOWER(name));

-- Crea la tabla de comunas (nivel 3), hija de cities
CREATE TABLE IF NOT EXISTS communes (           -- Catálogo de comunas/localidades
  id            INTEGER PRIMARY KEY,  -- PK autoincremental
  name          VARCHAR(100) NOT NULL,          -- Nombre de la comuna; obligatorio
  city_id       INTEGER NOT NULL,               -- FK a cities.id; cada comuna pertenece a una ciudad
  created_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp creación
  updated_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp actualización
  CONSTRAINT fk_communes_city                   -- Nombre explícito para la FK
    FOREIGN KEY (city_id)                       -- Columna local
    REFERENCES cities(id)                       -- Tabla/columna remota
    ON UPDATE CASCADE ON DELETE RESTRICT        -- No permite borrar ciudad si tiene comunas; actualiza en cascada cambios de id
);

-- Índice único compuesto (city_id + nombre normalizado)
-- Evita duplicar "Providencia" dentro de la misma ciudad
CREATE UNIQUE INDEX IF NOT EXISTS ux_communes_city_name ON communes (city_id, LOWER(name));

-- Catálogo de roles de usuario (perfiles/permisos lógicos)
-- NOTA: No depende de otras tablas; será referenciado por users.role
CREATE TABLE IF NOT EXISTS roles (              -- Tabla de roles
  id            INTEGER PRIMARY KEY,  -- PK autoincremental
  description   VARCHAR(100) NOT NULL,          -- Nombre/etiqueta del rol (p. ej. 'Administrador', 'Vendedor')
  created_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp creación
  updated_at    TIMESTAMP DEFAULT NOW()         -- Timestamp actualización
);

-- Índice único case-insensitive para no repetir descripciones de rol con diferente casing
CREATE UNIQUE INDEX IF NOT EXISTS ux_roles_description ON roles (LOWER(description));

INSERT INTO roles (id, description, created_at, updated_at) VALUES
(1, 'Administrador', NOW(), NOW()),
(2, 'Cliente',       NOW(), NOW()),
(3, 'Cotizador',     NOW(), NOW());


-- =========================================================
-- Tabla: users
-- =========================================================
-- Esta tabla almacena la información de las personas que acceden al sistema SGALT,
-- ya sean administradores, técnicos, secretarias, vendedores u otros perfiles definidos
-- en la tabla 'roles'.
-- Cada usuario tiene un correo único que sirve como credencial principal de inicio de sesión.
-- =========================================================

CREATE TABLE IF NOT EXISTS users (                            -- Se crea la tabla solo si no existe
    id SERIAL PRIMARY KEY,

  -- Identificador único autoincremental para cada usuario.
  -- Se utiliza como clave primaria (PK) y como referencia en otras tablas (por ejemplo: quotations.user_id).

  first_name     VARCHAR(100) NOT NULL,  
  -- Primer nombre del usuario (obligatorio).
  -- Se recomienda usar solo el primer nombre para evitar redundancia.

  last_name_1    VARCHAR(100) NOT NULL,  
  -- Primer apellido del usuario (obligatorio).
  -- Forma parte del nombre completo que puede mostrarse en la interfaz o informes.

  last_name_2    VARCHAR(100),  
  -- Segundo apellido del usuario (opcional).
  -- No todos los usuarios tienen un segundo apellido, por lo que se permite NULL.

  email          VARCHAR(255) NOT NULL,  
  -- Correo electrónico del usuario, utilizado para autenticación.
  -- Tiene restricción de unicidad más abajo (sin distinguir mayúsculas/minúsculas).

  password_hash  VARCHAR(255) NOT NULL,  
  -- Hash de la contraseña en formato encriptado (por ejemplo con bcrypt).
  -- No se almacenan contraseñas en texto plano por motivos de seguridad.

  role_id        INTEGER,  
  -- Clave foránea hacia 'roles.id'.
  -- Define el rol o perfil del usuario dentro del sistema (Administrador, Vendedor, Técnico, etc.).
  -- Puede ser NULL si el usuario aún no tiene un rol asignado.

  is_active      BOOLEAN DEFAULT TRUE,  
  -- Indica si la cuenta del usuario está activa (TRUE) o deshabilitada (FALSE).
  -- Se usa para bloquear temporalmente usuarios sin eliminarlos.

  created_at     TIMESTAMP DEFAULT NOW(),  
  -- Fecha y hora de creación del registro.
  -- Se completa automáticamente cuando se inserta el usuario.

  updated_at     TIMESTAMP DEFAULT NOW(),  
  -- Fecha y hora de la última actualización.
  -- Se actualiza automáticamente mediante el trigger global `set_updated_at`.
  soft_delete  BOOLEAN  NULL DEFAULT FALSE,

  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE SET NULL  
  -- Clave foránea hacia 'roles.id':
  --   - Si se actualiza el ID en la tabla 'roles', el cambio se propaga (CASCADE).
  --   - Si se elimina un rol, el campo 'role' del usuario afectado pasa a NULL,
  --     evitando la eliminación del usuario (SET NULL).
);  
-- Fin definición de tabla 'users'
-- CREATE SEQUENCE users_id_seq OWNED BY public.users.id;
-- =========================================================
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_users_role ON users(role_id);
-- Índice simple para mejorar el rendimiento de las consultas por 'role',
-- por ejemplo, cuando se listan todos los usuarios de un rol específico.

-- Unicidad case-insensitive del email
CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users (LOWER(email));
-- Restricción de unicidad sobre el campo 'email' sin distinguir mayúsculas/minúsculas.
-- Evita duplicar correos con variaciones como 'Usuario@...' y 'usuario@...'.

 
INSERT INTO users (id, first_name, last_name_1, last_name_2, email, password_hash, role_id, is_active, created_at, updated_at) VALUES
(1, 'Cristóbal', 'Larraín', 'Errázuriz', 'clarra.in@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 1, TRUE, NOW(), NOW()),

(2, 'Daniela', 'Gutiérrez', 'Moreno', 'dgutierrez@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 1, TRUE, NOW(), NOW()),

(3, 'Javiera', 'Oyarzún', 'Torrealba', 'j.oyarzun@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 2, TRUE, NOW(), NOW()),

(4, 'Kevin', 'Albornoz', 'Pérez', 'kevin.albornoz@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 2, TRUE, NOW(), NOW()),

(5, 'Paula', 'Muñoz', NULL, 'paula.munoz@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 2, TRUE, NOW(), NOW()),

(6, 'Brian', 'Cortés', 'Saavedra', 'bcortes@empresa.cl',
 '$2b$10$j3m2v4yai0YOTn6lM0tsrubmDJbPgWPL1rXgdScQsg8EvIBDCGZze', 2, TRUE, NOW(), NOW());


 

-- =========================================================
-- Tabla: clients
-- =========================================================
-- Esta tabla almacena los datos de las empresas o personas
-- que contratan los servicios del laboratorio (clientes).
-- Cada cliente puede tener múltiples solicitudes de cotización
-- y cotizaciones asociadas en otras tablas (quotation_request y quotations).
-- =========================================================

CREATE TABLE IF NOT EXISTS clients (                      -- Crea la tabla si no existe
  id                SERIAL PRIMARY KEY,
  -- Identificador único autoincremental (clave primaria).
  -- Este valor es interno y no se muestra al cliente.
  -- Otras tablas (como quotation_request) usarán este campo como FK (client_id).

  company_rut       VARCHAR(20)  NOT NULL,
  -- Rol Único Tributario (RUT) o identificación fiscal del cliente.
  -- Es obligatorio y debe ser único dentro de la base de datos.
  -- Permite identificar de manera inequívoca a cada empresa o persona jurídica.

  company_name      VARCHAR(255) NOT NULL,
  -- Razón social o nombre de la empresa del cliente.
  -- También obligatorio; se usa para mostrar el nombre en las cotizaciones.

  contact_name      VARCHAR(255)  NULL,
  -- Nombre del contacto principal del cliente (persona natural).
  -- Puede ser un encargado de adquisiciones, ingeniería o administración.
  -- No es obligatorio.

  contact_email     VARCHAR(255) NULL,
  -- Correo electrónico del contacto principal.
  -- No se marca como NOT NULL para permitir registrar clientes sin contacto definido aún.
  -- Se recomienda validar formato en el backend antes de insertar o actualizar.

  contact_phone     VARCHAR(50) NULL,
  -- Teléfono del contacto principal (celular o fijo).
  -- Campo libre para incluir formatos como "+56 9 1234 5678" o "22 345 6789".

  created_at        TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora en que se registró el cliente.
  -- Se asigna automáticamente al insertar un nuevo registro.

  updated_at        TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de la última actualización del registro.
  -- Este campo se actualiza automáticamente mediante el trigger global `set_updated_at`.
  soft_delete  BOOLEAN  NULL DEFAULT FALSE,
  CONSTRAINT ux_clients_rut UNIQUE (company_rut)
  -- Restricción de unicidad para evitar clientes duplicados con el mismo RUT.
  -- PostgreSQL no distingue mayúsculas/minúsculas en VARCHAR,
  -- pero aquí se asume que el formato de RUT será siempre normalizado (ejemplo: “76.123.456-7”).
);
-- Fin definición tabla clients

-- =========================================================poer
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_clients_company_name ON clients (LOWER(company_name));
-- Crea un índice en minúsculas sobre el nombre de la empresa.
-- Mejora el rendimiento de búsquedas por nombre sin distinguir mayúsculas/minúsculas.
-- Ejemplo de uso beneficiado:
--   SELECT * FROM clients WHERE LOWER(company_name) LIKE '%geocontrol%';

DO $$
DECLARE
  seq_name TEXT;
BEGIN
  -- Detecta automáticamente la secuencia asociada a la columna ID
  SELECT pg_get_serial_sequence('clients', 'id') INTO seq_name;

  -- Ajusta para iniciar desde 100
  EXECUTE 'ALTER SEQUENCE ' || seq_name || ' RESTART WITH 100;';
END $$;

-- =========================================================
-- Tabla: services
-- =========================================================
-- Esta tabla almacena el catálogo de servicios que ofrece el laboratorio,
-- como ensayos, controles en terreno, análisis de materiales, etc.
-- Cada servicio representa una unidad ofertable que puede incluirse
-- dentro de una cotización o solicitud de cotización.
-- =========================================================

CREATE TABLE IF NOT EXISTS services (                       -- Crea la tabla si no existe
  id            SERIAL PRIMARY KEY,
  -- Identificador único autoincremental del servicio.
  -- Se utiliza como clave primaria (PK) y también se referencia
  -- desde otras tablas (por ejemplo: quotation_items.service_id).

  name          VARCHAR(150) NOT NULL,
  -- Nombre del servicio ofrecido (obligatorio).
  -- Ejemplo: "Ensayo de Compresión de Probetas de Hormigón".
  -- Debe ser lo suficientemente descriptivo para aparecer en una cotización o informe.

  area          VARCHAR(150) NOT NULL,
  -- Área o categoría a la que pertenece el servicio.
  -- Ejemplo: "Hormigón y Mortero", "Suelos", "Asfaltos", etc.
  -- Facilita la organización del catálogo y la posterior clasificación en informes o interfaces.

  norma         VARCHAR(150) NOT NULL,
  -- Norma técnica asociada al servicio (obligatoria).
  -- Ejemplo: "NCh1037/1 Of.2009" o "ASTM C39".
  -- Permite identificar el procedimiento bajo el cual se realiza el ensayo o control.

  unit          VARCHAR(150) NOT NULL,
  -- Unidad de medida o cobro del servicio (obligatoria).
  -- Ejemplo: "m³", "unidad", "m²", "muestra".
  -- Se utiliza en las cotizaciones para determinar precios unitarios y subtotales.

  description   TEXT,
  -- Descripción opcional más detallada del servicio.
  -- Puede incluir condiciones, observaciones, limitaciones o alcance del ensayo.
  -- No es obligatoria y se puede mostrar como texto auxiliar en el frontend.

  base_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Precio base o unitario del servicio expresado en moneda local (CLP).
  -- El tipo NUMERIC(12,2) permite hasta 10 dígitos enteros y 2 decimales (precisión suficiente para cotizaciones).
  -- Valor por defecto = 0, para evitar errores en inserciones sin definir precio.

  created_at    TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de creación del registro.
  -- Se completa automáticamente al insertar el servicio.

  updated_at    TIMESTAMP DEFAULT NOW(),
  soft_delete  BOOLEAN  NULL DEFAULT FALSE
  -- Fecha y hora de la última actualización del servicio.
  -- Se actualiza automáticamente mediante el trigger global `set_updated_at`.
);
-- Fin definición tabla services

-- =========================================================
-- Índices complementarios
-- =========================================================
-- Unicidad case-insensitive del nombre de servicio
CREATE UNIQUE INDEX IF NOT EXISTS ux_services_name ON services (LOWER(name));
-- Restricción de unicidad del nombre del servicio, ignorando mayúsculas/minúsculas.
-- Evita duplicados como "Ensayo Proctor" y "ensayo proctor".



-- =========================================================
-- Tabla: quotation_request
-- =========================================================
-- Esta tabla registra todas las solicitudes de cotización que
-- los clientes envían al laboratorio para requerir uno o varios servicios.
--
-- Cada solicitud pertenece a un cliente (clients.id) y puede incluir:
--   - Datos de contacto del solicitante.
--   - Ubicación de la obra o faena donde se requieren los servicios.
--   - Una descripción de los servicios solicitados.
--   - Estado del proceso (recibida, revisada, aprobada, etc.).
--   - Información sobre quién revisó la solicitud y cuándo.
--
-- Posteriormente, cada solicitud puede dar origen a una o más
-- cotizaciones formales almacenadas en la tabla 'quotations'.
-- =========================================================

CREATE TABLE IF NOT EXISTS quotation_request (             -- Crea la tabla si no existe
  id                   SERIAL PRIMARY KEY,
  -- Identificador único autoincremental de la solicitud de cotización.
  -- Es la clave primaria (PK) y será referenciada en la tabla 'quotations.request_id'.

  client_id            INTEGER,
  -- Clave foránea hacia 'clients.id'.
  -- Indica qué cliente está realizando la solicitud.
  -- Puede ser NULL para permitir solicitudes preliminares de clientes aún no registrados formalmente.

  requester_full_name  VARCHAR(255) NOT NULL,
  -- Nombre completo de la persona que realiza la solicitud (obligatorio).
  -- Puede ser distinto del contacto principal del cliente (por ejemplo, un residente de obra o ingeniero externo).

  requester_email      VARCHAR(255) NOT NULL,
  -- Correo electrónico de quien realiza la solicitud.
  -- Obligatorio para poder enviar respuestas o cotizaciones.

  requester_phone      VARCHAR(20),
  -- Teléfono de contacto del solicitante (opcional).

  service_description  TEXT,
  -- Descripción libre de los servicios requeridos o del trabajo solicitado.
  -- Puede incluir especificaciones, normas, cantidades o cualquier información relevante.

  obra_direccion       VARCHAR(255),
  -- Dirección de la obra, faena o ubicación donde se prestarán los servicios.
  -- Es opcional, pero recomendable cuando se trata de trabajos en terreno.

  commune_id           INTEGER,
  city_id              INTEGER,
  region_id            INTEGER,
  -- Identificadores de ubicación geográfica.
  -- Cada uno es una clave foránea hacia las tablas maestras:
  --   region_id  → regions.id
  --   city_id    → cities.id
  --   commune_id → communes.id
  -- Estos campos permiten identificar con precisión dónde se realizará el trabajo solicitado.
	competence_capacity VARCHAR(2)   NULL,
	need_subcontracting_services VARCHAR(20)   NULL,
	independence_issue VARCHAR(2)   NULL,
  status               VARCHAR(20) NOT NULL,
  -- Estado actual de la solicitud (obligatorio).
  -- Ejemplos posibles: 'recibida', 'revisada', 'en proceso', 'cerrada', 'rechazada'.
  -- Permite controlar el flujo de trabajo y filtrarlas en el frontend o backend.

  reviewed_by          INTEGER,          -- users.id
  -- Clave foránea hacia 'users.id'.
  -- Indica qué usuario del laboratorio (por ejemplo, un encargado técnico o vendedor)
  -- revisó la solicitud de cotización.

  reviewed_at          TIMESTAMP,
  -- Fecha y hora en que el usuario asignado revisó la solicitud.
  -- Se completa cuando la solicitud cambia de estado a “revisada” o “evaluada”.

  review_notes         TEXT,
  -- Campo libre para que el revisor deje observaciones internas o comentarios técnicos.

  received_at          TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora en que la solicitud fue recibida por el sistema.
  -- Se genera automáticamente al momento de insertarla.

  created_at           TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora en que el registro fue creado en la base de datos.
  -- Puede coincidir con received_at, pero se mantiene por consistencia con otras tablas.
 soft_delete  BOOLEAN  NULL DEFAULT FALSE,
  updated_at           TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de la última actualización del registro.
  -- Se actualiza automáticamente mediante el trigger global 'set_updated_at'.

  -- =========================================================
  -- Definición de claves foráneas
  -- =========================================================

  CONSTRAINT fk_qreq_client
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  -- Si se modifica el ID del cliente, se propaga el cambio (CASCADE).
  -- Si se elimina el cliente, la solicitud conserva su historial con client_id = NULL.

  CONSTRAINT fk_qreq_commune
    FOREIGN KEY (commune_id) REFERENCES communes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  -- Referencia a la comuna (nivel más específico de ubicación).
  -- Se mantiene incluso si se borra la comuna, asignando NULL.

  CONSTRAINT fk_qreq_city
    FOREIGN KEY (city_id) REFERENCES cities(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  -- Referencia a la ciudad.

  CONSTRAINT fk_qreq_region
    FOREIGN KEY (region_id) REFERENCES regions(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  -- Referencia a la región.

  CONSTRAINT fk_qreq_reviewed_by
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
  -- Relación con 'users.id' para saber quién revisó la solicitud.
  -- Si el usuario se elimina, el campo pasa a NULL, pero se conserva el registro histórico.
);
-- Fin definición de tabla quotation_request

-- =========================================================
-- Índices complementarios
-- =========================================================

CREATE INDEX IF NOT EXISTS ix_qreq_status ON quotation_request(status);
-- Índice para acelerar búsquedas y listados por estado.
-- Ejemplo de uso: SELECT * FROM quotation_request WHERE status = 'revisada';

CREATE INDEX IF NOT EXISTS ix_qreq_client_id ON quotation_request(client_id);
-- Índice que mejora las consultas que filtran por cliente.
-- Ejemplo de uso: SELECT * FROM quotation_request WHERE client_id = 10;



-- =========================================================
-- Tabla: quotations
-- =========================================================
-- Esta tabla almacena las cotizaciones formales generadas por el laboratorio
-- a partir de una solicitud de cotización (quotation_request).
--
-- Cada registro representa una cotización emitida a un cliente.
-- Contiene información resumida de la solicitud, el usuario que la elaboró,
-- los montos, el estado del documento y el enlace al archivo PDF.
-- =========================================================

CREATE TABLE IF NOT EXISTS quotations (                      -- Crea la tabla si no existe
  id               SERIAL PRIMARY KEY,
  -- Identificador único autoincremental para cada cotización (clave primaria).
  -- Referenciado por 'quotation_items.quotation_id'.

  quote_number     BIGINT NOT NULL,             -- folio/ correlativo visible
  -- Número correlativo o folio de la cotización, visible para el cliente.
  -- Este número se genera a partir de una secuencia (ver bloque posterior).
  -- Se usa para identificar fácilmente cotizaciones sin exponer el ID interno.

  request_id       INTEGER,                     -- quotation_request.id
  -- Clave foránea hacia 'quotation_request.id'.
  -- Indica a qué solicitud de cotización corresponde esta cotización.
  -- Puede ser NULL si se creó directamente sin solicitud previa.

  user_id          INTEGER,                     -- vendedor/elaborador (users.id)
  -- Clave foránea hacia 'users.id'.
  -- Identifica al usuario (vendedor, secretaria o encargado técnico)
  -- que elaboró la cotización.
   quotation_token text null,
  request_summary  TEXT NULL,
  -- Resumen del contenido o alcance de la solicitud que dio origen a la cotización.
  -- Este campo se rellena al momento de emitirla, describiendo brevemente los servicios ofrecidos.

  issue_date       DATE NULL,
  -- Fecha de emisión de la cotización.
  -- Se usa para el control de vigencia y registro histórico.

  status           VARCHAR(20) NOT NULL DEFAULT 'CREADA',
  -- Estado de la cotización (obligatorio).
  -- Ejemplos: 'borrador', 'emitida', 'enviada', 'aceptada', 'rechazada', 'vencida'.
  -- Permite controlar su ciclo de vida dentro del sistema.

  discount  NUMERIC(12,2) NULL DEFAULT 0,

  subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Monto total sin impuestos, calculado como la suma de los subtotales de cada ítem.

  total            NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Monto total con impuestos incluidos: subtotal + tax_amount.

  pdf_url          TEXT NULL,
  -- Ruta o enlace al archivo PDF generado para la cotización.
  -- Puede ser un archivo almacenado en el servidor o en un bucket de Object Storage.

  created_at       TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de creación del registro.
  soft_delete  BOOLEAN  NULL DEFAULT FALSE,
  updated_at       TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de la última actualización del registro.

  -- =========================================================
  -- Restricciones y claves foráneas
  -- =========================================================

  CONSTRAINT ux_quotations_quote_number UNIQUE (quote_number),
  -- Garantiza que cada número de cotización (folio) sea único en el sistema.

  CONSTRAINT fk_quotations_request
    FOREIGN KEY (request_id) REFERENCES quotation_request(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  -- Si se modifica el ID de la solicitud original, el cambio se propaga (CASCADE).
  -- Si la solicitud es eliminada, la cotización conserva su historial con request_id = NULL.

  CONSTRAINT fk_quotations_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
  -- Relación con el usuario que generó la cotización.
  -- Si el usuario se elimina, el campo pasa a NULL, preservando la cotización.
);
-- Fin definición tabla quotations

-- =========================================================
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_quotations_status ON quotations(status);
-- Índice que acelera la búsqueda de cotizaciones por estado.
-- Ejemplo: SELECT * FROM quotations WHERE status = 'emitida';



-- =========================================================
-- Tabla: quotation_items
-- =========================================================
-- Esta tabla almacena los ítems o líneas de detalle asociados
-- a cada cotización registrada en 'quotations'.
--
-- Cada ítem representa un servicio cotizado, su cantidad, precio unitario,
-- descuentos y subtotal correspondiente.
-- =========================================================

CREATE TABLE IF NOT EXISTS quotation_items (                 -- Crea la tabla si no existe
  id            SERIAL PRIMARY KEY,
  -- Identificador único autoincremental del ítem (clave primaria).

  quotation_id  INTEGER NOT NULL,
  -- Clave foránea hacia 'quotations.id'.
  -- Identifica a qué cotización pertenece el ítem.
  -- Es obligatorio, ya que un ítem no puede existir sin cotización asociada.

  service_id    INTEGER,
  -- Clave foránea hacia 'services.id'.
  -- Permite vincular el ítem con un servicio registrado en el catálogo general.
  -- Puede ser NULL si se trata de un servicio no estándar o personalizado.


  quantity      INTEGER NOT NULL DEFAULT 1,
  -- Cantidad del servicio cotizado (por defecto 1).

  unit          VARCHAR(50),
  -- Unidad de medida o cobro asociada al ítem.
  -- Puede copiarse desde 'services.unit' o escribirse manualmente (m³, unidad, muestra, etc.).

  unit_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Precio unitario del servicio (sin impuesto).

  subtotal      NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Subtotal de la línea, calculado como:
  -- (quantity * unit_price) - line_discount.

  created_at    TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de creación del registro.

  updated_at    TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de la última actualización (se actualiza vía trigger global).

  -- =========================================================
  -- Restricciones y claves foráneas
  -- =========================================================

  CONSTRAINT fk_qitems_quotation
    FOREIGN KEY (quotation_id) REFERENCES quotations(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  -- Si se elimina una cotización, todos sus ítems asociados
  -- se eliminan automáticamente (CASCADE).
  -- Si el ID de la cotización cambia, se actualiza en cascada.

  CONSTRAINT fk_qitems_service
    FOREIGN KEY (service_id) REFERENCES services(id)
    ON UPDATE CASCADE ON DELETE SET NULL
  -- Si se elimina un servicio del catálogo, el ítem conserva la información
  -- pero pierde la referencia al servicio original (service_id pasa a NULL).
);
-- Fin definición tabla quotation_items

-- =========================================================
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_qitems_quotation_id ON quotation_items(quotation_id);
-- Índice que mejora el rendimiento al listar los ítems de una cotización.
-- Ejemplo: SELECT * FROM quotation_items WHERE quotation_id = 45;


INSERT INTO regions (id, name, created_at, updated_at) VALUES
(1,  'Arica y Parinacota',                          NOW(), NOW()),
(2,  'Tarapacá',                                    NOW(), NOW()),
(3,  'Antofagasta',                                 NOW(), NOW()),
(4,  'Atacama',                                     NOW(), NOW()),
(5,  'Coquimbo',                                    NOW(), NOW()),
(6,  'Valparaíso',                                  NOW(), NOW()),
(7,  'Metropolitana de Santiago',                   NOW(), NOW()),
(8,  'Libertador General Bernardo O’Higgins',       NOW(), NOW()),
(9,  'Maule',                                       NOW(), NOW()),
(10, 'Ñuble',                                       NOW(), NOW()),
(11, 'Biobío',                                      NOW(), NOW()),
(12, 'La Araucanía',                                NOW(), NOW()),
(13, 'Los Ríos',                                    NOW(), NOW()),
(14, 'Los Lagos',                                   NOW(), NOW()),
(15, 'Aysén del General Carlos Ibáñez del Campo',   NOW(), NOW()),
(16, 'Magallanes y de la Antártica Chilena',        NOW(), NOW());

 

INSERT INTO cities (id, name, region_id, created_at, updated_at) VALUES
-- Región 1: Arica y Parinacota
(1,  'Arica',        1,  NOW(), NOW()),

-- Región 2: Tarapacá
(2,  'Iquique',      2,  NOW(), NOW()),

-- Región 3: Antofagasta
(3,  'Antofagasta',  3,  NOW(), NOW()),

-- Región 4: Atacama
(4,  'Copiapó',      4,  NOW(), NOW()),

-- Región 5: Coquimbo
(5,  'La Serena',    5,  NOW(), NOW()),

-- Región 6: Valparaíso
(6,  'Valparaíso',   6,  NOW(), NOW()),

-- Región 7: Metropolitana de Santiago
(7,  'Santiago',     7,  NOW(), NOW()),

-- Región 8: Libertador General Bernardo O’Higgins
(8,  'Rancagua',     8,  NOW(), NOW()),

-- Región 9: Maule
(9,  'Talca',        9,  NOW(), NOW()),

-- Región 10: Ñuble
(10, 'Chillán',      10, NOW(), NOW()),

-- Región 11: Biobío
(11, 'Concepción',   11, NOW(), NOW()),

-- Región 12: La Araucanía
(12, 'Temuco',       12, NOW(), NOW()),

-- Región 13: Los Ríos
(13, 'Valdivia',     13, NOW(), NOW()),

-- Región 14: Los Lagos
(14, 'Puerto Montt', 14, NOW(), NOW()),

-- Región 15: Aysén
(15, 'Coyhaique',    15, NOW(), NOW()),

-- Región 16: Magallanes y de la Antártica Chilena
(16, 'Punta Arenas', 16, NOW(), NOW());

 
INSERT INTO communes (id, name, city_id, created_at, updated_at) VALUES
(1, 'Santiago', 7, NOW(), NOW()),
(2, 'Cerrillos', 7, NOW(), NOW()),
(3, 'Cerro Navia', 7, NOW(), NOW()),
(4, 'Conchalí', 7, NOW(), NOW()),
(5, 'El Bosque', 7, NOW(), NOW()),
(6, 'Estación Central', 7, NOW(), NOW()),
(7, 'Huechuraba', 7, NOW(), NOW()),
(8, 'Independencia', 7, NOW(), NOW()),
(9, 'La Cisterna', 7, NOW(), NOW()),
(10, 'La Florida', 7, NOW(), NOW()),
(11, 'La Granja', 7, NOW(), NOW()),
(12, 'La Pintana', 7, NOW(), NOW()),
(13, 'La Reina', 7, NOW(), NOW()),
(14, 'Las Condes', 7, NOW(), NOW()),
(15, 'Lo Barnechea', 7, NOW(), NOW()),
(16, 'Lo Espejo', 7, NOW(), NOW()),
(17, 'Lo Prado', 7, NOW(), NOW()),
(18, 'Macul', 7, NOW(), NOW()),
(19, 'Maipú', 7, NOW(), NOW()),
(20, 'Ñuñoa', 7, NOW(), NOW()),
(21, 'Pedro Aguirre Cerda', 7, NOW(), NOW()),
(22, 'Peñalolén', 7, NOW(), NOW()),
(23, 'Providencia', 7, NOW(), NOW()),
(24, 'Pudahuel', 7, NOW(), NOW()),
(25, 'Quilicura', 7, NOW(), NOW()),
(26, 'Quinta Normal', 7, NOW(), NOW()),
(27, 'Recoleta', 7, NOW(), NOW()),
(28, 'Renca', 7, NOW(), NOW()),
(29, 'San Joaquín', 7, NOW(), NOW()),
(30, 'San Miguel', 7, NOW(), NOW()),
(31, 'San Ramón', 7, NOW(), NOW()),
(32, 'Vitacura', 7, NOW(), NOW()),

-- Provincia Cordillera (también RM, si quieres que dependan del mismo city_id)
(33, 'Puente Alto', 7, NOW(), NOW()),
(34, 'Pirque', 7, NOW(), NOW()),
(35, 'San José de Maipo', 7, NOW(), NOW()),

-- Provincia Chacabuco
(36, 'Colina', 7, NOW(), NOW()),
(37, 'Lampa', 7, NOW(), NOW()),
(38, 'Tiltil', 7, NOW(), NOW()),

-- Provincia Maipo
(39, 'San Bernardo', 7, NOW(), NOW()),
(40, 'Buin', 7, NOW(), NOW()),
(41, 'Calera de Tango', 7, NOW(), NOW()),
(42, 'Paine', 7, NOW(), NOW()),

-- Provincia Melipilla
(43, 'Melipilla', 7, NOW(), NOW()),
(44, 'Alhué', 7, NOW(), NOW()),
(45, 'Curacaví', 7, NOW(), NOW()),
(46, 'María Pinto', 7, NOW(), NOW()),
(47, 'San Pedro', 7, NOW(), NOW()),

-- Provincia Talagante
(48, 'Talagante', 7, NOW(), NOW()),
(49, 'El Monte', 7, NOW(), NOW()),
(50, 'Isla de Maipo', 7, NOW(), NOW()),
(51, 'Padre Hurtado', 7, NOW(), NOW()),
(52, 'Peñaflor', 7, NOW(), NOW()),

(53,  'Arica',                   1, NOW(), NOW()),
(54,  'Camarones',               1, NOW(), NOW()),
(55,  'Putre',                   1, NOW(), NOW()),
(56,  'General Lagos',           1, NOW(), NOW()),
(57,  'Valle de Lluta',          1, NOW(), NOW()),

-- Región 2: Iquique
(58,  'Iquique',                 2, NOW(), NOW()),
(59,  'Alto Hospicio',           2, NOW(), NOW()),
(60,  'Pozo Almonte',            2, NOW(), NOW()),
(61,  'Camiña',                  2, NOW(), NOW()),
(62, 'Huara',                   2, NOW(), NOW()),
-- Región 3: Antofagasta
(63, 'Antofagasta',             3, NOW(), NOW()),
(64, 'Mejillones',              3, NOW(), NOW()),
(65, 'Sierra Gorda',            3, NOW(), NOW()),
(66, 'Taltal',                  3, NOW(), NOW()),
(67, 'La Chimba',               3, NOW(), NOW()),

-- Región 4: Copiapó
(68, 'Copiapó',                 4, NOW(), NOW()),
(69, 'Tierra Amarilla',         4, NOW(), NOW()),
(70, 'Caldera',                 4, NOW(), NOW()),
(71, 'Paipote',                 4, NOW(), NOW()),
(72, 'San Fernando (Copiapó)',  4, NOW(), NOW()),

-- Región 5: La Serena
(73, 'La Serena',               5, NOW(), NOW()),
(74, 'Coquimbo',                5, NOW(), NOW()),
(75, 'Vicuña',                  5, NOW(), NOW()),
(76, 'La Higuera',              5, NOW(), NOW()),
(77, 'Tongoy',                  5, NOW(), NOW()),

-- Región 6: Valparaíso
(78, 'Valparaíso',              6, NOW(), NOW()),
(79, 'Viña del Mar',            6, NOW(), NOW()),
(80, 'Concón',                  6, NOW(), NOW()),
(81, 'Quilpué',                 6, NOW(), NOW()),
(82, 'Villa Alemana',           6, NOW(), NOW()),

-- Región 8: Rancagua
(88, 'Rancagua',                8, NOW(), NOW()),
(89, 'Machalí',                 8, NOW(), NOW()),
(90, 'Graneros',                8, NOW(), NOW()),
(91, 'Olivar',                  8, NOW(), NOW()),
(92, 'Requínoa',                8, NOW(), NOW()),

-- Región 9: Talca
(93, 'Talca',                   9, NOW(), NOW()),
(94, 'Maule',                   9, NOW(), NOW()),
(95, 'San Clemente',            9, NOW(), NOW()),
(96, 'Río Claro',               9, NOW(), NOW()),
(97, 'Pelarco',                 9, NOW(), NOW()),

-- Región 10: Chillán
(98, 'Chillán',                 10, NOW(), NOW()),
(99, 'Chillán Viejo',           10, NOW(), NOW()),
(100, 'Bulnes',                  10, NOW(), NOW()),
(101, 'San Carlos',              10, NOW(), NOW()),
(102, 'Coihueco',                10, NOW(), NOW()),

-- Región 11: Concepción
(103, 'Concepción',              11, NOW(), NOW()),
(104, 'Talcahuano',              11, NOW(), NOW()),
(105, 'San Pedro de la Paz',     11, NOW(), NOW()),
(106, 'Chiguayante',             11, NOW(), NOW()),
(107, 'Hualpén',                 11, NOW(), NOW()),

-- Región 12: Temuco
(108, 'Temuco',                  12, NOW(), NOW()),
(109, 'Padre Las Casas',         12, NOW(), NOW()),
(110, 'Villarrica',              12, NOW(), NOW()),
(111, 'Pitrufquén',              12, NOW(), NOW()),
(112, 'Gorbea',                  12, NOW(), NOW()),

-- Región 13: Valdivia
(113, 'Valdivia',                13, NOW(), NOW()),
(114, 'Los Lagos',               13, NOW(), NOW()),
(115, 'Panguipulli',             13, NOW(), NOW()),
(116, 'Corral',                  13, NOW(), NOW()),
(117, 'Mariquina',               13, NOW(), NOW()),

-- Región 14: Puerto Montt
(118, 'Puerto Montt',            14, NOW(), NOW()),
(119, 'Puerto Varas',            14, NOW(), NOW()),
(120, 'Llanquihue',              14, NOW(), NOW()),
(121, 'Frutillar',               14, NOW(), NOW()),
(122, 'Alerce',                  14, NOW(), NOW()),

-- Región 15: Coyhaique
(123, 'Coyhaique',               15, NOW(), NOW()),
(124, 'Balmaceda',               15, NOW(), NOW()),
(125, 'Puerto Aysén',            15, NOW(), NOW()),
(126, 'Villa Ortega',            15, NOW(), NOW()),
(127, 'Ñirehuao',                15, NOW(), NOW()),

-- Región 16: Punta Arenas
(128, 'Punta Arenas',            16, NOW(), NOW()),
(129, 'Puerto Natales',          16, NOW(), NOW()),
(130, 'Porvenir',                16, NOW(), NOW()),
(131, 'Cabo de Hornos',          16, NOW(), NOW()),
(132, 'Laguna Blanca',           16, NOW(), NOW());

 INSERT INTO clients (
  id,
  company_rut,
  company_name,
  contact_name,
  contact_email,
  contact_phone,
  created_at,
  updated_at
) VALUES
(1, '89.862.200-2','LATAM Airlines Group S.A.','Contacto LATAM','contacto@latam.com','+56 2 2579 8990',NOW(),NOW()),
(2, '90.222.000-3','Empresas CMPC S.A.','Contacto CMPC','contacto@cmpc.cl','+56 2 2441 2000',NOW(),NOW()),
(3, '61.704.000-K','Corporación Nacional del Cobre de Chile','Contacto CODELCO','contacto@codelco.cl','+56 2 2690 3000',NOW(),NOW()),
(4, '97.004.000-5','Banco de Chile','Contacto Banco de Chile','contacto@bancochile.cl','+56 2 2637 1111',NOW(),NOW()),
(5, '90.749.000-9','Falabella S.A.','Contacto Falabella','contacto@falabella.cl','+56 2 2380 2000',NOW(),NOW()),
(6, '92.604.000-6','Empresa Nacional del Petróleo','Contacto ENAP','contacto@enap.cl','+56 2 2729 7000',NOW(),NOW()),
(7, '97.006.000-1','Copec S.A.','Contacto Copec','contacto@copec.cl','+56 2 xxxxx xxxx',NOW(),NOW()),
(8, '96.940.000-7','SQM S.A.','Contacto SQM','contacto@sqm.com','+56 2 xxxxx xxxx',NOW(),NOW()),
(9, '76.600.628-0','CMPC Celulosa S.A.','Contacto CMPC Celulosa','contacto@cmpc.cl','+56 2 xxxx xxxx',NOW(),NOW()),
(10,'76.700.000-5','Entel Chile S.A.','Contacto Entel','contacto@entel.cl','+56 2 xxxx xxxx',NOW(),NOW());



 INSERT INTO quotation_request (
  client_id,
  requester_full_name,
  requester_email,
  requester_phone,
  service_description,
  obra_direccion,
  commune_id,
  city_id,
  region_id,
  competence_capacity,
  need_subcontracting_services,
  independence_issue,
  status,
  received_at,
  reviewed_by,
  reviewed_at,
  review_notes,
  created_at,
  updated_at
) VALUES

-- 1) LATAM Airlines Group S.A. (client_id = 1) - SANTIAGO (RM)
-- Pudahuel
(1,'María Torres','m.torres@latam.com','+56 9 4455 1122',
 'Mantención eléctrica en bodega central',
 'Av. Américo Vespucio 901',
 24, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '7 days', NULL, NULL, NULL, NOW(), NOW()),

-- San Joaquín
(1,'Pedro Soto','p.soto@latam.com','+56 9 8899 2211',
 'Revisión estructural área técnica',
 'Av. Departamental 2000',
 29, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '3 days', NULL, NULL, NULL, NOW(), NOW()),

-- Pedro Aguirre Cerda
(1,'Ana Martínez','a.martinez@latam.com','+56 9 7722 1100',
 'Inspección de hangares',
 'Pedro Aguirre Cerda 4500',
 21, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '1 days', NULL, NULL, NULL, NOW(), NOW()),

-- 2) Empresas CMPC S.A. (client_id = 2) - CONCEPCIÓN (Biobío)
(2,'Juan Herrera','j.herrera@cmpc.cl','+56 9 8811 5599',
 'Revisión instalaciones forestales',
 'Camino a Laja 123',
 103, 11, 11,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '6 days', NULL, NULL, NULL, NOW(), NOW()),

(2,'Daniela Vergara','d.vergara@cmpc.cl','+56 9 6611 3322',
 'Instalación eléctrica planta Nueva Imperial',
 'Ruta S-40 KM 12',
 104, 11, 11,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '4 days', NULL, NULL, NULL, NOW(), NOW()),

(2,'Ricardo Silva','r.silva@cmpc.cl','+56 9 7711 8800',
 'Evaluación riesgos industriales',
 'Camino Los Boldos 500',
 105, 11, 11,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NOW(), NOW()),

-- 3) CODELCO (client_id = 3) - ANTOFAGASTA (Región 3)
(3,'Claudio Muñoz','c.munoz@codelco.cl','+56 9 9911 5533',
 'Inspección mina subterránea',
 'Sector Chuquicamata S/N',
 63, 3, 3,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '3 days', NULL, NULL, NULL, NOW(), NOW()),

(3,'Sofía Reyes','s.reyes@codelco.cl','+56 9 8222 1144',
 'Instalación nuevos tableros eléctricos',
 'Av. Minería 123',
 64, 3, 3,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NOW(), NOW()),

-- 4) Banco de Chile (client_id = 4) - SANTIAGO (RM)
(4,'Marcelo Pinto','m.pinto@bancochile.cl','+56 9 5511 7744',
 'Revisión de sucursal principal',
 'Paseo Ahumada 251',
 1, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '5 days', NULL, NULL, NULL, NOW(), NOW()),

(4,'Valentina Araya','v.araya@bancochile.cl','+56 9 6611 8800',
 'Cambio de instalaciones HVAC',
 'Av. Apoquindo 1234',
 14, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '1 days', NULL, NULL, NULL, NOW(), NOW()),

-- 5) Falabella (client_id = 5) - SANTIAGO (RM)
(5,'Camila López','c.lopez@falabella.cl','+56 9 4411 9922',
 'Revisión tienda mall Alto Las Condes',
 'Av. Kennedy 9001',
 14, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '7 days', NULL, NULL, NULL, NOW(), NOW()),

(5,'Hernán Pino','h.pino@falabella.cl','+56 9 8811 1233',
 'Instalación paneles eléctricos',
 'Av. Vicuña Mackenna 300',
 20, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '3 days', NULL, NULL, NULL, NOW(), NOW()),

-- 6) ENAP (client_id = 6) - VALPARAÍSO (Región 6)
(6,'Andrea Ruiz','a.ruiz@enap.cl','+56 9 7722 5566',
 'Inspección planta petroquímica',
 'Ruta 5 Sur KM 16',
 78, 6, 6,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '4 days', NULL, NULL, NULL, NOW(), NOW()),

(6,'Sebastián Parra','s.parra@enap.cl','+56 9 5511 6611',
 'Revisión compresores industriales',
 'Camino a Refinería 200',
 80, 6, 6,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '1 days', NULL, NULL, NULL, NOW(), NOW()),

-- 7) Copec (client_id = 7) - SANTIAGO (RM)
(7,'Jorge Contreras','j.contreras@copec.cl','+56 9 8811 9911',
 'Revisión estación de servicio',
 'Av. Matta 550',
 19, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '3 days', NULL, NULL, NULL, NOW(), NOW()),

(7,'Patricia Díaz','p.diaz@copec.cl','+56 9 7711 4411',
 'Mantención surtidores',
 'Av. Grecia 2001',
 10, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NOW(), NOW()),

-- 8) SQM (client_id = 8) - ANTOFAGASTA (Región 3)
(8,'Tomás Villarroel','t.villarroel@sqm.com','+56 9 6611 8822',
 'Inspección planta Salar de Atacama',
 'Ruta B-355 KM 28',
 65, 3, 3,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '6 days', NULL, NULL, NULL, NOW(), NOW()),

(8,'Fernanda Morales','f.morales@sqm.com','+56 9 7711 0099',
 'Instalación transformador',
 'Av. Los Volcanes 123',
 63, 3, 3,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NOW(), NOW()),

-- 9) CMPC Celulosa (client_id = 9) - CONCEPCIÓN (Biobío)
(9,'Eduardo Campos','e.campos@cmpc.cl','+56 9 9911 4400',
 'Revisión planta Laja',
 'Camino Central 155',
 104, 11, 11,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '5 days', NULL, NULL, NULL, NOW(), NOW()),

-- 10) Entel (client_id = 10) - SANTIAGO (RM)
(10,'Gabriel Hidalgo','g.hidalgo@entel.cl','+56 9 8811 5566',
 'Instalación red eléctrica sala servidores',
 'Av. Providencia 111',
 23, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '3 days', NULL, NULL, NULL, NOW(), NOW()),

(10,'Monserrat Jara','m.jara@entel.cl','+56 9 7711 8822',
 'Revisión torres de transmisión',
 'Camino Antena Norte',
 36, 7, 7,
 null,null,null,
 'PENDIENTE', NOW() - INTERVAL '1 days', NULL, NULL, NULL, NOW(), NOW());



-- =========================================================
-- Triggers para mantener updated_at
-- =========================================================
-- Este bloque crea una función y un conjunto de triggers que actualizan
-- automáticamente el campo "updated_at" cada vez que se modifica un registro
-- en cualquier tabla que contenga dicho campo.
--
-- De esta manera, se mantiene un control temporal preciso sobre los cambios
-- realizados en las tablas principales del sistema (regiones, usuarios, clientes, etc.),
-- sin necesidad de que el backend lo actualice manualmente en cada UPDATE.
-- =========================================================

-- =========================================================
-- 1️⃣ Función: set_updated_at()
-- =========================================================
-- Esta función será llamada por los triggers antes de cada UPDATE.
-- Su objetivo es sobrescribir el valor de "updated_at" con la hora actual (NOW()).

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$                      -- Define una función que retorna un tipo TRIGGER
BEGIN
  NEW.updated_at := NOW();                 -- Asigna la fecha/hora actual al campo updated_at del registro modificado
  RETURN NEW;                              -- Devuelve el registro modificado (obligatorio en triggers BEFORE UPDATE)
END; $$ LANGUAGE plpgsql;                  -- Fin del cuerpo de la función, escrita en lenguaje PL/pgSQL

-- =========================================================
-- 2️⃣ Bloque anónimo DO para crear los triggers automáticamente
-- =========================================================
-- En lugar de crear un trigger manualmente para cada tabla,
-- este bloque recorre una lista predefinida de tablas que contienen
-- el campo "updated_at" y les genera el trigger correspondiente.
--
-- Ventaja: si más adelante agregas o quitas una tabla,
-- solo debes modificar la lista dentro del bucle.

DO $$                                      -- Bloque anónimo ejecutable directamente (sin necesidad de función persistente)
DECLARE
  r RECORD;                                -- Variable que servirá para iterar sobre las tablas seleccionadas
BEGIN
  -- Recorre todas las tablas públicas incluidas en la lista
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'            -- Filtra solo las tablas del esquema público
      AND tablename IN (                   -- Lista explícita de tablas que poseen columna "updated_at"
        'regions','cities','communes','roles','users',
        'clients','services','quotation_request',
        'quotations','quotation_items'
      )
  LOOP
    -- Por cada tabla, se ejecuta dinámicamente un bloque de SQL que:
    -- 1. Elimina el trigger existente si ya estaba creado (para evitar duplicados).
    -- 2. Crea un nuevo trigger BEFORE UPDATE que llama a la función set_updated_at().

    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_updated_at_%1$s ON %1$s;
       CREATE TRIGGER trg_set_updated_at_%1$s
       BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      r.tablename
    );
    -- %1$s representa el nombre de la tabla actual del bucle (r.tablename),
    -- y se usa dentro del texto SQL formateado mediante la función "format".
    --
    -- Resultado: se crea un trigger por cada tabla con nombre:
    --   trg_set_updated_at_regions
    --   trg_set_updated_at_users
    --   trg_set_updated_at_clients
    --   etc.
    --
    -- Cada trigger se ejecutará automáticamente antes de una actualización (BEFORE UPDATE),
    -- y llamará a la función set_updated_at(), que establecerá el nuevo valor del timestamp.
  END LOOP;
END $$;                                   -- Fin del bloque DO anónimo

-- =========================================================
-- 3️⃣ Confirmación de cambios
-- =========================================================

-- Asegura que todas las operaciones (creación de la función y triggers)
-- se guarden de forma permanente en la base de datos.
-- En entornos Docker, este COMMIT marca el final del script de inicialización.



-- =========================================================
-- SECUENCIA PARA FOLIO DE COTIZACIONES
-- =========================================================
-- Este bloque crea y configura una secuencia en PostgreSQL
-- que se utiliza para generar automáticamente un número de folio
-- único y correlativo en la tabla "quotations".
--
-- Así, cada vez que se inserta una nueva cotización, el sistema
-- asigna un número de folio consecutivo (1000, 1001, 1002, etc.)
-- sin intervención manual ni riesgo de duplicados.
-- =========================================================

-- =========================================================
-- 1️⃣ Creación de la secuencia
-- =========================================================
-- La secuencia actúa como un contador independiente que PostgreSQL
-- incrementa automáticamente cada vez que se utiliza la función nextval().

CREATE SEQUENCE IF NOT EXISTS quotations_quote_number_seq
    START WITH 1000       -- 🔸 Valor inicial del contador (primer folio). Modifícalo según el punto de partida deseado.
    INCREMENT BY 1         -- Aumenta en 1 por cada nueva cotización insertada.
    MINVALUE 1             -- Valor mínimo permitido por la secuencia.
    OWNED BY quotations.quote_number;  -- Vincula la secuencia a la columna quote_number de la tabla quotations.
-- La cláusula "OWNED BY" asegura que si la tabla o columna son eliminadas,
-- PostgreSQL elimine automáticamente la secuencia asociada.
-- Esto mantiene la base de datos limpia y evita secuencias huérfanas.
-- =========================================================

-- =========================================================
-- 2️⃣ Asociación de la secuencia con la columna quote_number
-- =========================================================
-- Este paso establece que, si no se especifica manualmente un número de folio
-- al insertar una nueva cotización, PostgreSQL lo obtendrá automáticamente
-- desde la secuencia creada en el paso anterior.

ALTER TABLE quotations ALTER COLUMN quote_number
SET DEFAULT nextval('quotations_quote_number_seq');
-- "nextval('nombre_de_secuencia')" obtiene el siguiente número disponible
-- y lo incrementa internamente en la secuencia.
--
-- Ejemplo:
--   Primer registro  -> quote_number = 1000
--   Segundo registro -> quote_number = 1001
--   Tercer registro  -> quote_number = 1002
--
-- Esto garantiza numeración secuencial y automática.
-- =========================================================



-- =========================================================
-- Semillas mínimas (opcionales)
-- =========================================================
-- INSERT INTO roles(description) VALUES ('Administrador'), ('Vendedor') ON CONFLICT DO NOTHING;
-- INSERT INTO regions(name) VALUES ('Región de Arica y Parinacota') ON CONFLICT DO NOTHING;
 INSERT INTO services (id, name, area, norma, unit, description, base_price)
VALUES
-- ======================
--     SUELOS
-- ======================
(1, 'Granulometría por tamizado', 'Suelos', 'NCh165/1', 'muestra',
 'Determinación de la distribución granulométrica en suelos mediante tamizado.', 18000),

(2, 'Límites de Atterberg (LL, LP)', 'Suelos', 'NCh1515', 'muestra',
 'Determinación del límite líquido y plástico para clasificación de suelos.', 22000),

(3, 'Proctor Modificado', 'Suelos', 'NCh1536/2', 'muestra',
 'Determinación de la relación humedad–densidad y densidad máxima.', 35000),

(4, 'Densidad “in situ” método de arena', 'Suelos', 'NCh1516', 'unidad',
 'Control de compactación mediante el método del cono de arena.', 28000),

(5, 'Densidad “in situ” método nuclear', 'Suelos', 'ASTM D6938', 'unidad',
 'Medición instantánea de densidad y humedad con densímetro nuclear.', 32000),

(6, 'CBR – Índice de soporte California', 'Suelos', 'ASTM D1883', 'muestra',
 'Ensayo para determinar la capacidad soporte del suelo.', 48000),

-- ======================
--     HORMIGÓN
-- ======================
(7, 'Ensayo de compresión de probetas de hormigón', 'Hormigón', 'NCh1037/1', 'unidad',
 'Ensayo de resistencia a la compresión de probetas cilíndricas.', 4500),

(8, 'Toma de probetas en terreno', 'Hormigón', 'NCh1019', 'unidad',
 'Moldeo, curado inicial y etiquetado de probetas en obra.', 6500),

(9, 'Revenimiento (Slump Test)', 'Hormigón', 'NCh2256', 'unidad',
 'Determinación del asentamiento del hormigón fresco.', 6000),

(10, 'Contenido de aire en hormigón', 'Hormigón', 'NCh1561', 'unidad',
 'Medición del aire ocluido en hormigón mediante método de presión.', 9000),

-- ======================
--     ASFALTOS
-- ======================
(11, 'Contenido de ligante asfáltico', 'Asfalto', 'NCh1514', 'muestra',
 'Determinación del contenido de ligante en mezcla asfáltica.', 45000),

(12, 'Granulometría de mezclas asfálticas', 'Asfalto', 'NCh1534', 'muestra',
 'Determinación granulométrica mediante extracción y tamizado.', 42000),

(13, 'Ensayo Marshall (Estabilidad y Flujo)', 'Asfalto', 'NCh1537', 'muestra',
 'Determinación de estabilidad y flujo Marshall.', 55000),

-- ======================
-- CONTROL EN TERRENO
-- ======================
(14, 'Placa de carga', 'Control en Terreno', 'ASTM D1196', 'unidad',
 'Ensayo de placa para determinar el módulo de reacción del suelo.', 120000),

(15, 'Control de compactación superficial', 'Control en Terreno', 'NCh1546', 'unidad',
 'Densidad superficial para verificar compactación en capas.', 25000),

-- ======================
-- OTROS SERVICIOS
-- ======================
(16, 'Ensayo de densidad nuclear (visita)', 'Ensayo/Control', 'ASTM D6938', 'visita',
 'Visita a terreno con densímetro nuclear, incluye operador.', 45000),

(17, 'Retiro de muestras en terreno', 'Logística', '-', 'visita',
 'Retiro y traslado de muestras desde obra al laboratorio.', 15000);


-- ============================================
-- SEED: QUOTATIONS + QUOTATION_ITEMS
-- FECHA: 2025-11-30
-- AUTOR: SEBASTIÁN
-- ============================================

-- ================================================================
-- 2) QUOTATIONS (8 REGISTROS / 2 CREADAS, 2 RECHAZADAS,
--                2 ACEPTADAS, 2 ENVIADAS)
-- ================================================================

-- ===========================
-- 2.1) CREADAS (2)
-- ===========================

-- QUOTATION 1 - request_id = 2 / Cotizadora Javiera (user_id = 3)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(1, 1001, 2, 3, 'Solicitud de revisión estructural aérea', '2025-11-30',
 'CREADA', 0, 18000, 18000, NOW(), NOW(), false);

-- QUOTATION 2 - request_id = 3 / Cotizadora Javiera (user_id = 3)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(2, 1002, 3, 3, 'Inspección de hangar', '2025-11-30',
 'CREADA', 0, 22000, 22000, NOW(), NOW(), false);


-- ===========================
-- 2.2) RECHAZADAS (2)
-- ===========================

-- QUOTATION 3 - request_id = 4 / Cotizador Kevin (user_id = 4)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(3, 1003, 4, 4, 'Revisión instalaciones eléctricas', '2025-11-29',
 'RECHAZADA', 0, 15000, 15000, NOW(), NOW(), false);

-- QUOTATION 4 - request_id = 5 / Cotizador Kevin (user_id = 4)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(4, 1004, 5, 4, 'Instalación eléctrica en planta', '2025-11-29',
 'RECHAZADA', 0, 28000, 28000, NOW(), NOW(), false);


-- ===========================
-- 2.3) ACEPTADAS (2)
-- ===========================

-- QUOTATION 5 - request_id = 6 / Cotizadora Paula (user_id = 5)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(5, 1005, 6, 5, 'Evaluación riesgos industriales', '2025-11-29',
 'ACEPTADA', 0, 35000, 35000, NOW(), NOW(), false);

-- QUOTATION 6 - request_id = 7 / Cotizadora Paula (user_id = 5)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(6, 1006, 7, 5, 'Inspección mina subterránea', '2025-11-30',
 'ACEPTADA', 0, 45000, 45000, NOW(), NOW(), false);


-- ===========================
-- 2.4) ENVIADAS (2)
-- ===========================

-- QUOTATION 7 - request_id = 8 / Cotizador Brian (user_id = 6)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(7, 1007, 8, 6, 'Ensayo de resistencia hormigón', '2025-11-30',
 'ENVIADA', 0, 60000, 60000, NOW(), NOW(), false);

-- QUOTATION 8 - request_id = 9 / Cotizador Brian (user_id = 6)
INSERT INTO quotations (
  id, quote_number, request_id, user_id, request_summary, issue_date,
  status, discount, subtotal, total, created_at, updated_at, soft_delete
) VALUES
(8, 1008, 9, 6, 'Módulo, curado de muestras', '2025-11-30',
 'ENVIADA', 0, 45000, 45000, NOW(), NOW(), false);


-- ================================================================
-- 3) QUOTATION_ITEMS (ORDEN ESTRUCTURA)
--     (id, quotation_id, service_id, quantity, unit,
--      unit_price, subtotal, created_at, updated_at)
-- ================================================================

-- ===========================
-- 3.1) CREADAS
-- ===========================
INSERT INTO quotation_items VALUES
(1, 1, 1, 1, 'muestra', 18000, 18000, NOW(), NOW());

INSERT INTO quotation_items VALUES
(2, 2, 2, 1, 'muestra', 22000, 22000, NOW(), NOW());


-- ===========================
-- 3.2) RECHAZADAS
-- ===========================
INSERT INTO quotation_items VALUES
(3, 3, 3, 1, 'muestra', 15000, 15000, NOW(), NOW());

INSERT INTO quotation_items VALUES
(4, 4, 4, 1, 'muestra', 28000, 28000, NOW(), NOW());


-- ===========================
-- 3.3) ACEPTADAS
-- ===========================
INSERT INTO quotation_items VALUES
(5, 5, 3, 1, 'muestra', 35000, 35000, NOW(), NOW());

INSERT INTO quotation_items VALUES
(6, 6, 4, 1, 'muestra', 45000, 45000, NOW(), NOW());


-- ===========================
-- 3.4) ENVIADAS
-- ===========================
INSERT INTO quotation_items VALUES
(7, 7, 9, 1, 'unidad', 60000, 60000, NOW(), NOW());

INSERT INTO quotation_items VALUES
(8, 8, 10, 1, 'unidad', 45000, 45000, NOW(), NOW());

-- ============================================
-- FIN DEL ARCHIVO
-- ============================================



-- ============================
-- 1) CATÁLOGO DE ESTADOS
-- ============================
CREATE TABLE IF NOT EXISTS notification_status (
  id      smallint PRIMARY KEY,
  code    varchar(30) NOT NULL UNIQUE,  -- 'UNREAD', 'READ'
  name    varchar(50) NOT NULL          -- 'No leída', 'Leída'
);

INSERT INTO notification_status (id, code, name) VALUES
  (1, 'UNREAD', 'No leída'),
  (2, 'READ',   'Leída')
ON CONFLICT (id) DO NOTHING;

-- =================================
-- 2) CATÁLOGO DE TIPOS DE MENSAJE
-- =================================
CREATE TABLE IF NOT EXISTS notification_message_type (
  id              smallint PRIMARY KEY,
  code            varchar(50) NOT NULL UNIQUE,   -- 'QUOTATION_CREATED', 'QUOTATION_STATUS_CHANGED', etc.
  name            varchar(100) NOT NULL,         -- Nombre legible
  default_title   varchar(150),                  -- Título por defecto
  default_message text,                          -- Mensaje base opcional
  icon_name       varchar(50),                   -- Nombre del ícono MUI (para el front)
  chip_color      varchar(30)                    -- Color del Chip MUI: 'primary', 'success', etc.
);

INSERT INTO notification_message_type
  (id, code, name, default_title, default_message, icon_name, chip_color)
VALUES
  (
    1,
    'QUOTATION_CREATED',
    'Nueva Solicitud de Cotización',
    'Nueva Solicitud de Cotización',
    NULL,
    'PersonAddAlt1',
    'primary'
  ),
  (
    2,
    'QUOTATION_STATUS_CHANGED',
    'Actualización de estado de cotización',
    'Actualización de estado de la cotización',
    NULL,
    'ChangeCircle',
    'success'
  )
ON CONFLICT (id) DO NOTHING;

-- ================================
-- 3) CATÁLOGO DE TIPOS DE ENTIDAD
-- ================================
CREATE TABLE IF NOT EXISTS notification_entity_type (
  id         smallint PRIMARY KEY,
  code       varchar(50) NOT NULL UNIQUE,  -- 'QUOTATION_REQUEST', 'QUOTATION', etc.
  name       varchar(100) NOT NULL,        -- Descripción legible
  table_name varchar(100) NOT NULL         -- Nombre de la tabla de negocio
);

INSERT INTO notification_entity_type (id, code, name, table_name) VALUES
  (1, 'QUOTATION_REQUEST', 'Solicitud de cotización', 'quotation_request'),
  (2, 'QUOTATION',         'Cotización',              'quotations')
ON CONFLICT (id) DO NOTHING;

-- ================================
-- 4) TABLA PRINCIPAL DE NOTIFICACIONES
-- ================================
CREATE TABLE IF NOT EXISTS notifications (
  id               serial PRIMARY KEY,

  message_type_id  smallint NOT NULL
    REFERENCES notification_message_type(id),

  entity_type_id   smallint NOT NULL
    REFERENCES notification_entity_type(id),

  entity_id        int NOT NULL,                -- PK de la entidad (quotation_request.id, quotations.id, etc.)

  recipient_id     int NOT NULL                 -- Usuario destinatario
    REFERENCES users(id),

  status_id        smallint NOT NULL DEFAULT 1  -- 1 = UNREAD
    REFERENCES notification_status(id),

  custom_title     varchar(150),                -- Permite sobreescribir el título por defecto
  custom_message   text,                        -- Permite sobreescribir el mensaje por defecto

  created_at       timestamp(6) NOT NULL DEFAULT now(),
  read_at          timestamp(6),

  payload          jsonb                        -- Datos extra (estado antes/después, resumen, etc.)
);

-- ================================
-- 5) ÍNDICES RECOMENDADOS
-- ================================
-- Búsqueda rápida por usuario + estado
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_status
  ON notifications (recipient_id, status_id, created_at DESC);

-- Búsqueda por entidad (para traer todas las notificaciones de una solicitud/cotización)
CREATE INDEX IF NOT EXISTS idx_notifications_entity
  ON notifications (entity_type_id, entity_id);

  INSERT INTO notifications 
(message_type_id, entity_type_id, entity_id, recipient_id, status_id, custom_title, custom_message, payload, created_at, read_at)
VALUES
-- solicitud 2
(1, 1, 2, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Pedro Soto', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 3
(1, 1, 3, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Ana Martínez', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 4
(1, 1, 4, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Juan Herrera', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 5
(1, 1, 5, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Daniela Vergara', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 6
(1, 1, 6, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Ricardo Silva', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 7
(1, 1, 7, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Claudio Muñoz', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 8
(1, 1, 8, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Sofía Reyes', jsonb_build_object('status','PENDIENTE'), now(), now()),

-- solicitud 9
(1, 1, 9, 1, 2, 'Nueva Solicitud de Cotización',
 'Cotizante: Marcelo Pinto', jsonb_build_object('status','PENDIENTE'), now(), now());

-- ================================================================
-- NOTIFICACIONES PARA CADA COTIZACIÓN (TODAS EN ESTADO READ)
-- ================================================================
 -- ===================================================================
-- NOTIFICACIONES PARA LAS 8 COTIZACIONES (TODAS UNREAD)
-- ===================================================================

INSERT INTO notifications (
  message_type_id,
  entity_type_id,
  entity_id,
  recipient_id,
  status_id,
  custom_title,
  custom_message,
  payload,
  created_at
)
VALUES
-- =========================
-- COTIZACIÓN 1001 (CREADA)
-- =========================
(2, 2, 1, 3, 1,
 'Estado de cotización #1001',
 'La cotización #1001 (Solicitud de revisión estructural aérea) fue CREADA.',
 '{"quotation_id":1,"quote_number":1001,"status":"CREADA","request_summary":"Solicitud de revisión estructural aérea"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1002 (CREADA)
-- =========================
(2, 2, 2, 3, 1,
 'Estado de cotización #1002',
 'La cotización #1002 (Inspección de hangar) fue CREADA.',
 '{"quotation_id":2,"quote_number":1002,"status":"CREADA","request_summary":"Inspección de hangar"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1003 (RECHAZADA)
-- =========================
(2, 2, 3, 4, 1,
 'Estado de cotización #1003',
 'La cotización #1003 (Revisión instalaciones eléctricas) fue RECHAZADA.',
 '{"quotation_id":3,"quote_number":1003,"status":"RECHAZADA","request_summary":"Revisión instalaciones eléctricas"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1004 (RECHAZADA)
-- =========================
(2, 2, 4, 4, 1,
 'Estado de cotización #1004',
 'La cotización #1004 (Instalación eléctrica en planta) fue RECHAZADA.',
 '{"quotation_id":4,"quote_number":1004,"status":"RECHAZADA","request_summary":"Instalación eléctrica en planta"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1005 (ACEPTADA)
-- =========================
(2, 2, 5, 5, 1,
 'Estado de cotización #1005',
 'La cotización #1005 (Evaluación riesgos industriales) fue ACEPTADA.',
 '{"quotation_id":5,"quote_number":1005,"status":"ACEPTADA","request_summary":"Evaluación riesgos industriales"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1006 (ACEPTADA)
-- =========================
(2, 2, 6, 5, 1,
 'Estado de cotización #1006',
 'La cotización #1006 (Inspección mina subterránea) fue ACEPTADA.',
 '{"quotation_id":6,"quote_number":1006,"status":"ACEPTADA","request_summary":"Inspección mina subterránea"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1007 (ENVIADA)
-- =========================
(2, 2, 7, 6, 1,
 'Estado de cotización #1007',
 'La cotización #1007 (Ensayo de resistencia hormigón) fue ENVIADA.',
 '{"quotation_id":7,"quote_number":1007,"status":"ENVIADA","request_summary":"Ensayo de resistencia hormigón"}',
 NOW()),

-- =========================
-- COTIZACIÓN 1008 (ENVIADA)
-- =========================
(2, 2, 8, 6, 1,
 'Estado de cotización #1008',
 'La cotización #1008 (Módulo, curado de muestras) fue ENVIADA.',
 '{"quotation_id":8,"quote_number":1008,"status":"ENVIADA","request_summary":"Módulo, curado de muestras"}',
 NOW());
 
SELECT setval(
  pg_get_serial_sequence('quotations', 'quote_number'),
  (SELECT COALESCE(MAX(quote_number), 1) FROM quotations)
);

-- QUOTATIONS
SELECT setval(
  pg_get_serial_sequence('quotations', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM quotations)
);

-- QUOTATION_ITEMS
SELECT setval(
  pg_get_serial_sequence('quotation_items', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM quotation_items)
);

-- QUOTATION_REQUEST
SELECT setval(
  pg_get_serial_sequence('quotation_request', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM quotation_request)
);

-- USERS
SELECT setval(
  pg_get_serial_sequence('users', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM users)
);

-- SERVICES
SELECT setval(
  pg_get_serial_sequence('services', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM services)
);

-- ROLES
SELECT setval(
  pg_get_serial_sequence('roles', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM roles)
);

-- CLIENTS
SELECT setval(
  pg_get_serial_sequence('clients', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM clients)
);

-- COMMUNES
SELECT setval(
  pg_get_serial_sequence('communes', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM communes)
);

-- CITIES
SELECT setval(
  pg_get_serial_sequence('cities', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM cities)
);

-- REGIONS
SELECT setval(
  pg_get_serial_sequence('regions', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM regions)
);

-- NOTIFICATIONS
SELECT setval(
  pg_get_serial_sequence('notifications', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM notifications)
);

-- NOTIFICATION_STATUS
SELECT setval(
  pg_get_serial_sequence('notification_status', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM notification_status)
);

-- NOTIFICATION_MESSAGE_TYPE
SELECT setval(
  pg_get_serial_sequence('notification_message_type', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM notification_message_type)
);

-- NOTIFICATION_ENTITY_TYPE
SELECT setval(
  pg_get_serial_sequence('notification_entity_type', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM notification_entity_type)
);


COMMIT;