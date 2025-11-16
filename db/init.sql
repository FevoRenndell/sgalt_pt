-- =========================================================
-- SGALT - Esquema base (PostgreSQL)
-- Fecha: YYYY-MM-DD
-- =========================================================

-- Opcional las funciones crypto/uuid
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- =========================================================
-- Tablas maestras: regiones, ciudades, comunas, roles
-- (Catálogos jerárquicos para ubicar obras/solicitudes y
--  controlar perfiles de usuario)
-- Relaciones clave:
--   regions(1) ──< cities(*) ──< communes(*)
--   roles es independiente y se referenciará desde users.role_id
-- =========================================================

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
-- NOTA: No depende de otras tablas; será referenciado por users.role_id
CREATE TABLE IF NOT EXISTS roles (              -- Tabla de roles
  id            INTEGER PRIMARY KEY,  -- PK autoincremental
  description   VARCHAR(100) NOT NULL,          -- Nombre/etiqueta del rol (p. ej. 'Administrador', 'Vendedor')
  created_at    TIMESTAMP DEFAULT NOW(),        -- Timestamp creación
  updated_at    TIMESTAMP DEFAULT NOW()         -- Timestamp actualización
);

-- Índice único case-insensitive para no repetir descripciones de rol con diferente casing
CREATE UNIQUE INDEX IF NOT EXISTS ux_roles_description ON roles (LOWER(description));



-- =========================================================
-- Tabla: users
-- =========================================================
-- Esta tabla almacena la información de las personas que acceden al sistema SGALT,
-- ya sean administradores, técnicos, secretarias, vendedores u otros perfiles definidos
-- en la tabla 'roles'.
-- Cada usuario tiene un correo único que sirve como credencial principal de inicio de sesión.
-- =========================================================

CREATE TABLE IF NOT EXISTS users (                            -- Se crea la tabla solo si no existe
  id             INTEGER PRIMARY KEY AUTOINCREMENT,  
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

  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE SET NULL  
  -- Clave foránea hacia 'roles.id':
  --   - Si se actualiza el ID en la tabla 'roles', el cambio se propaga (CASCADE).
  --   - Si se elimina un rol, el campo 'role_id' del usuario afectado pasa a NULL,
  --     evitando la eliminación del usuario (SET NULL).
);  
-- Fin definición de tabla 'users'
CREATE SEQUENCE users_id_seq OWNED BY public.users.id;
-- =========================================================
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_users_role_id ON users(role_id);
-- Índice simple para mejorar el rendimiento de las consultas por 'role_id',
-- por ejemplo, cuando se listan todos los usuarios de un rol específico.

-- Unicidad case-insensitive del email
CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email ON users (LOWER(email));
-- Restricción de unicidad sobre el campo 'email' sin distinguir mayúsculas/minúsculas.
-- Evita duplicar correos con variaciones como 'Usuario@...' y 'usuario@...'.



-- =========================================================
-- Tabla: clients
-- =========================================================
-- Esta tabla almacena los datos de las empresas o personas
-- que contratan los servicios del laboratorio (clientes).
-- Cada cliente puede tener múltiples solicitudes de cotización
-- y cotizaciones asociadas en otras tablas (quotation_request y quotations).
-- =========================================================

CREATE TABLE IF NOT EXISTS clients (                      -- Crea la tabla si no existe
  id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

  contact_name      VARCHAR(255),
  -- Nombre del contacto principal del cliente (persona natural).
  -- Puede ser un encargado de adquisiciones, ingeniería o administración.
  -- No es obligatorio.

  contact_email     VARCHAR(255),
  -- Correo electrónico del contacto principal.
  -- No se marca como NOT NULL para permitir registrar clientes sin contacto definido aún.
  -- Se recomienda validar formato en el backend antes de insertar o actualizar.

  contact_phone     VARCHAR(50),
  -- Teléfono del contacto principal (celular o fijo).
  -- Campo libre para incluir formatos como "+56 9 1234 5678" o "22 345 6789".

  service_description TEXT,
  -- Campo descriptivo que permite anotar observaciones generales
  -- sobre los servicios que solicita o contrata el cliente.
  -- Por ejemplo: “Ensayos de compactación y resistencia de hormigón”.
  -- No es obligatorio, y se usa como información de referencia.

  created_at        TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora en que se registró el cliente.
  -- Se asigna automáticamente al insertar un nuevo registro.

  updated_at        TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de la última actualización del registro.
  -- Este campo se actualiza automáticamente mediante el trigger global `set_updated_at`.

  CONSTRAINT ux_clients_rut UNIQUE (company_rut)
  -- Restricción de unicidad para evitar clientes duplicados con el mismo RUT.
  -- PostgreSQL no distingue mayúsculas/minúsculas en VARCHAR,
  -- pero aquí se asume que el formato de RUT será siempre normalizado (ejemplo: “76.123.456-7”).
);
-- Fin definición tabla clients

-- =========================================================
-- Índices complementarios
-- =========================================================
CREATE INDEX IF NOT EXISTS ix_clients_company_name ON clients (LOWER(company_name));
-- Crea un índice en minúsculas sobre el nombre de la empresa.
-- Mejora el rendimiento de búsquedas por nombre sin distinguir mayúsculas/minúsculas.
-- Ejemplo de uso beneficiado:
--   SELECT * FROM clients WHERE LOWER(company_name) LIKE '%geocontrol%';



-- =========================================================
-- Tabla: services
-- =========================================================
-- Esta tabla almacena el catálogo de servicios que ofrece el laboratorio,
-- como ensayos, controles en terreno, análisis de materiales, etc.
-- Cada servicio representa una unidad ofertable que puede incluirse
-- dentro de una cotización o solicitud de cotización.
-- =========================================================

CREATE TABLE IF NOT EXISTS services (                       -- Crea la tabla si no existe
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

  updated_at    TIMESTAMP DEFAULT NOW()
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
  id                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

  request_summary  TEXT NOT NULL,
  -- Resumen del contenido o alcance de la solicitud que dio origen a la cotización.
  -- Este campo se rellena al momento de emitirla, describiendo brevemente los servicios ofrecidos.

  issue_date       DATE,
  -- Fecha de emisión de la cotización.
  -- Se usa para el control de vigencia y registro histórico.

  status           VARCHAR(20) NOT NULL,
  -- Estado de la cotización (obligatorio).
  -- Ejemplos: 'borrador', 'emitida', 'enviada', 'aceptada', 'rechazada', 'vencida'.
  -- Permite controlar su ciclo de vida dentro del sistema.

  subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Monto total sin impuestos, calculado como la suma de los subtotales de cada ítem.

  tax_rate         NUMERIC(5,4)  NOT NULL DEFAULT 0,   -- p.ej. 0.19 = 19%
  -- Tasa de impuesto aplicada a la cotización (por ejemplo, IVA).
  -- Se almacena en formato decimal (0.19 = 19%).
  -- Permite recalcular fácilmente el monto total si cambia el valor del IVA.

  tax_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Valor del impuesto calculado: subtotal * tax_rate.
  -- Guardarlo facilita reportes sin tener que recalcular cada vez.

  total            NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Monto total con impuestos incluidos: subtotal + tax_amount.

  pdf_url          TEXT,
  -- Ruta o enlace al archivo PDF generado para la cotización.
  -- Puede ser un archivo almacenado en el servidor o en un bucket de Object Storage.

  created_at       TIMESTAMP DEFAULT NOW(),
  -- Fecha y hora de creación del registro.

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
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Identificador único autoincremental del ítem (clave primaria).

  quotation_id  INTEGER NOT NULL,
  -- Clave foránea hacia 'quotations.id'.
  -- Identifica a qué cotización pertenece el ítem.
  -- Es obligatorio, ya que un ítem no puede existir sin cotización asociada.

  service_id    INTEGER,
  -- Clave foránea hacia 'services.id'.
  -- Permite vincular el ítem con un servicio registrado en el catálogo general.
  -- Puede ser NULL si se trata de un servicio no estándar o personalizado.

  description   TEXT NOT NULL,
  -- Descripción libre del ítem (obligatoria).
  -- Generalmente corresponde al nombre del servicio,
  -- pero se deja abierta para adaptaciones específicas (ej. “Control de compactación en obra X”).

  quantity      INTEGER NOT NULL DEFAULT 1,
  -- Cantidad del servicio cotizado (por defecto 1).

  unit          VARCHAR(50),
  -- Unidad de medida o cobro asociada al ítem.
  -- Puede copiarse desde 'services.unit' o escribirse manualmente (m³, unidad, muestra, etc.).

  unit_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Precio unitario del servicio (sin impuesto).

  line_discount NUMERIC(12,2) DEFAULT 0,
  -- Descuento aplicado a esta línea, si corresponde (en moneda, no en porcentaje).

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
COMMIT;
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
