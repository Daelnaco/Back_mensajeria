-- =======================================================================
-- Chat & Disputas — MySQL 8.0 · InnoDB · utf8mb4
-- =======================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Nota de integración entre squads:
-- - No se crean FK a “usuarios” ni a “order” (son de otros squads).
-- - Solo alineamos tipos: usuarios.id_usuario BIGINT UNSIGNED, order.id INT UNSIGNED.

DROP DATABASE IF EXISTS disputasBD;
CREATE DATABASE IF NOT EXISTS disputasBD;
USE disputasBD;

-- =======================================================================
-- 1. Modelo base (tablas) — lo mínimo para conversar, adjuntar, disputar y auditar
-- =======================================================================

DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS refund;
DROP TABLE IF EXISTS dispute_event;
DROP TABLE IF EXISTS dispute;
DROP TABLE IF EXISTS attachment;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS conversation_participant;
DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS schema_version;

/* --- USUARIOS (mínimo viable para que TypeORM no falle) --- */
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario           BIGINT UNSIGNED NOT NULL,
  correo               VARCHAR(255) NOT NULL,
  correo_normalizado   VARCHAR(255),
  estado               ENUM('activo','bloqueado','pendiente') NOT NULL DEFAULT 'activo',
  creado_en            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en         DATETIME NULL,
  PRIMARY KEY (id_usuario),
  KEY ix_usuarios_correo (correo)
);

/* --- PERFILES (la tabla que falta) --- */
CREATE TABLE IF NOT EXISTS perfiles (
  id_usuario                   BIGINT UNSIGNED NOT NULL,
  nombre_usuario               VARCHAR(50) NOT NULL,
  nombre_usuario_normalizado   VARCHAR(50) NOT NULL,
  nombre_completo              VARCHAR(120) NULL,
  rut                          VARCHAR(12) NULL,
  foto                         VARCHAR(500) NULL,
  pais                         VARCHAR(80) NULL,
  ciudad                       VARCHAR(80) NULL,
  creado_en                    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY ux_perfil_alias (nombre_usuario_normalizado),
  CONSTRAINT fk_perfil_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

/* --- Seeds básicos alineados con tus seeds de mensajería/disputas --- */
INSERT IGNORE INTO usuarios (id_usuario, correo, correo_normalizado)
VALUES
  (101, 'buyer@demo.local',  'buyer@demo.local'),
  (202, 'seller@demo.local', 'seller@demo.local');

INSERT IGNORE INTO perfiles (id_usuario, nombre_usuario, nombre_usuario_normalizado, nombre_completo, pais, ciudad)
VALUES
  (101, 'buyer.demo',  'buyer.demo',  'Comprador Demo', 'CL', 'Valparaíso'),
  (202, 'seller.demo', 'seller.demo', 'Vendedor Demo',  'CL', 'Santiago');


-- Conversaciones 1:1 (buyer <-> seller), opcionalmente ligadas a un pedido
CREATE TABLE conversation (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id          INT UNSIGNED NULL,
  buyer_id          BIGINT UNSIGNED NOT NULL,
  seller_id         BIGINT UNSIGNED NOT NULL,
  last_activity_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at        DATETIME(3) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Quiénes participan en la conversación (valida propiedad de mensajes)
CREATE TABLE conversation_participant (
  conversation_id   BIGINT UNSIGNED NOT NULL,
  user_id           BIGINT UNSIGNED NOT NULL,
  role              ENUM('buyer','seller','moderator') NOT NULL,
  PRIMARY KEY (conversation_id, user_id),
  CONSTRAINT fk_cp_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversation(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Mensajes del chat (texto o imagen)
CREATE TABLE message (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id   BIGINT UNSIGNED NOT NULL,
  sender_id         BIGINT UNSIGNED NOT NULL,
  sender_role       ENUM('buyer','seller','moderator') NOT NULL,
  type              ENUM('text','image') NOT NULL DEFAULT 'text',
  body              TEXT NULL,
  edited_at         DATETIME(3) NULL,
  deleted_at        DATETIME(3) NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_msg_participant
    FOREIGN KEY (conversation_id, sender_id)
    REFERENCES conversation_participant(conversation_id, user_id)
      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Adjuntos (referenciados, nunca binarios en BD)
CREATE TABLE attachment (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id        BIGINT UNSIGNED NOT NULL,
  mime              VARCHAR(100) NOT NULL,
  size_bytes        BIGINT UNSIGNED NOT NULL,
  storage_key       VARCHAR(255) NOT NULL,
  url_secure        VARCHAR(512) NOT NULL,
  scan_status       ENUM('pending','clean','infected') NOT NULL DEFAULT 'pending',
  width             INT NULL,
  height            INT NULL,
  checksum          CHAR(64) NOT NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_att_msg
    FOREIGN KEY (message_id) REFERENCES message(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Disputas sobre una conversación / pedido
CREATE TABLE dispute (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id   BIGINT UNSIGNED NULL,
  order_id          INT UNSIGNED NULL,
  opener_id         BIGINT UNSIGNED NOT NULL,
  reason ENUM(
    'not_received',       -- No recibí el producto
    'damaged',            -- Producto dañado
    'not_as_described',   -- No es como se describe
    'wrong_item',         -- Producto incorrecto
    'other'               -- Otro motivo
  ) NOT NULL,
  descripcion VARCHAR(255) NULL,
  status            ENUM('open','in_review','agreement_pending','closed','rejected') NOT NULL DEFAULT 'open',
  opened_at         DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  closed_at         DATETIME(3) NULL,
  updated_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at        DATETIME(3) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_disp_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversation(id)
      ON DELETE RESTRICT,
  CONSTRAINT fk_disp_opener_participant
    FOREIGN KEY (conversation_id, opener_id)
    REFERENCES conversation_participant(conversation_id, user_id)
      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Eventos de la disputa (mensajes internos, evidencias, acuerdos, cambios de estado)
CREATE TABLE dispute_event (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_id        BIGINT UNSIGNED NOT NULL,
  actor_id          BIGINT UNSIGNED NOT NULL,
  event_type        ENUM('message','evidence','agreement','status_change') NOT NULL,
  payload           JSON NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_de_dispute
    FOREIGN KEY (dispute_id) REFERENCES dispute(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Reembolsos asociados a una disputa (idempotentes)
CREATE TABLE refund (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_id        BIGINT UNSIGNED NOT NULL,
  amount_cents      INT UNSIGNED NOT NULL,
  currency          CHAR(3) NOT NULL,
  provider_ref      VARCHAR(100) NULL,
  status            ENUM('pending','succeeded','failed') NOT NULL DEFAULT 'pending',
  idempotency_key   VARCHAR(80) NOT NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_refund_idem (idempotency_key),
  CONSTRAINT fk_refund_dispute
    FOREIGN KEY (dispute_id) REFERENCES dispute(id)
      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Registro de auditoría (acciones sensibles)
CREATE TABLE audit_log (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_id          BIGINT UNSIGNED NULL,
  entity            ENUM('Conversation','Message','Dispute','Refund','Attachment') NOT NULL,
  entity_id         BIGINT UNSIGNED NOT NULL,
  action            VARCHAR(40) NOT NULL,
  metadata          JSON NULL,
  ip                VARCHAR(45) NULL,
  user_agent        VARCHAR(255) NULL,
  created_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Versionado de esquema para trazabilidad
CREATE TABLE schema_version (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  version    VARCHAR(120) NOT NULL,
  applied_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_schema_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT IGNORE INTO schema_version(version) VALUES ('2025_11_04_chat_disputes_v1');

-- =======================================================================
-- 2. Restricciones de dominio — reglas que el motor puede validar por sí solo
-- =======================================================================

-- Conversation: buyer y seller deben ser distintos
ALTER TABLE conversation
  ADD CONSTRAINT chk_conv_buyer_seller_diff CHECK (buyer_id <> seller_id);

-- Conversation: una conversación por par buyer/seller y pedido (NULL-safe)
ALTER TABLE conversation
  ADD COLUMN order_ref INT UNSIGNED AS (COALESCE(order_id, 0)) STORED;
CREATE UNIQUE INDEX uq_conv_pair_order ON conversation (buyer_id, seller_id, order_ref);

-- Message: coherencia entre tipo y cuerpo
ALTER TABLE message
  ADD CONSTRAINT chk_msg_type_body CHECK (
    (type='image' AND body IS NULL) OR
    (type='text'  AND (body IS NULL OR CHAR_LENGTH(body) >= 0))
  );

-- Attachment: tamaños/dimensiones válidas + evitar duplicados exactos por mensaje
ALTER TABLE attachment
  ADD CONSTRAINT chk_att_sizes CHECK (
    size_bytes > 0 AND (width IS NULL OR width > 0) AND (height IS NULL OR height > 0)
  );
CREATE UNIQUE INDEX uq_att_msg_checksum ON attachment (message_id, checksum);

-- Dispute: razón no vacía
ALTER TABLE dispute
  ADD CONSTRAINT chk_dispute_reason CHECK (CHAR_LENGTH(reason) > 0);

-- Refund: monto y moneda válidos
ALTER TABLE refund
  ADD CONSTRAINT chk_refund_amount_currency CHECK (amount_cents > 0 AND CHAR_LENGTH(currency) = 3);

-- AuditLog: acción informativa
ALTER TABLE audit_log
  ADD CONSTRAINT chk_audit_action CHECK (CHAR_LENGTH(action) > 0);

-- Soft-delete estricto: evitamos DELETE físico en tablas críticas
DROP TRIGGER IF EXISTS trg_conv_prevent_delete;
DELIMITER //
CREATE TRIGGER trg_conv_prevent_delete
BEFORE DELETE ON conversation
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete físico de conversation prohibido; use deleted_at.';
END//
DELIMITER ;

DROP TRIGGER IF EXISTS trg_msg_prevent_delete;
DELIMITER //
CREATE TRIGGER trg_msg_prevent_delete
BEFORE DELETE ON message
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete físico de message prohibido; use deleted_at.';
END//
DELIMITER ;

DROP TRIGGER IF EXISTS trg_dispute_prevent_delete;
DELIMITER //
CREATE TRIGGER trg_dispute_prevent_delete
BEFORE DELETE ON dispute
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Delete físico de dispute prohibido; use deleted_at.';
END//
DELIMITER ;

-- =======================================================================
-- 3. Reglas de negocio — lo que hace cumplir tu flujo (triggers)
-- =======================================================================

-- Al crear conversation, registramos buyer y seller como participantes
DROP TRIGGER IF EXISTS trg_conv_after_insert_participants;
DELIMITER //
CREATE TRIGGER trg_conv_after_insert_participants
AFTER INSERT ON conversation
FOR EACH ROW
BEGIN
  INSERT IGNORE INTO conversation_participant (conversation_id, user_id, role)
  VALUES (NEW.id, NEW.buyer_id, 'buyer'),
         (NEW.id, NEW.seller_id, 'seller');
END//
DELIMITER ;

-- Cada mensaje refresca la “actividad reciente” de la conversación
DROP TRIGGER IF EXISTS trg_msg_after_insert_touch_conversation;
DELIMITER //
CREATE TRIGGER trg_msg_after_insert_touch_conversation
AFTER INSERT ON message
FOR EACH ROW
BEGIN
  UPDATE conversation
     SET last_activity_at = GREATEST(NEW.created_at, last_activity_at)
   WHERE id = NEW.conversation_id;
END//
DELIMITER ;

-- El emisor debe pertenecer a la conversación y su rol debe coincidir
DROP TRIGGER IF EXISTS trg_msg_before_insert_validate_role;
DELIMITER //
CREATE TRIGGER trg_msg_before_insert_validate_role
BEFORE INSERT ON message
FOR EACH ROW
BEGIN
  DECLARE v_role ENUM('buyer','seller','moderator');
  SELECT cp.role INTO v_role
    FROM conversation_participant cp
   WHERE cp.conversation_id = NEW.conversation_id
     AND cp.user_id         = NEW.sender_id
   LIMIT 1;

  IF v_role IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El emisor no pertenece a la conversación.';
  END IF;
  IF v_role <> NEW.sender_role THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sender_role no coincide con el rol registrado.';
  END IF;
END//
DELIMITER ;

-- No se puede “mover” un mensaje a otra conversación ni cambiar su autor
DROP TRIGGER IF EXISTS trg_msg_before_update_immutable_keys;
DELIMITER //
CREATE TRIGGER trg_msg_before_update_immutable_keys
BEFORE UPDATE ON message
FOR EACH ROW
BEGIN
  IF NEW.conversation_id <> OLD.conversation_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede cambiar conversation_id de un mensaje.';
  END IF;
  IF NEW.sender_id <> OLD.sender_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede cambiar sender_id de un mensaje.';
  END IF;
END//
DELIMITER ;

-- Solo una disputa ACTIVA por order_id (múltiples cerradas/rechazadas son válidas)
ALTER TABLE dispute
  ADD COLUMN active_order_id INT UNSIGNED
    AS (CASE WHEN status IN ('open','in_review','agreement_pending') THEN order_id ELSE NULL END) STORED;
CREATE UNIQUE INDEX uq_dispute_one_active_per_order ON dispute (active_order_id);

-- No se reabren disputas cerradas/rechazadas
DROP TRIGGER IF EXISTS trg_dispute_before_update_no_reopen;
DELIMITER //
CREATE TRIGGER trg_dispute_before_update_no_reopen
BEFORE UPDATE ON dispute
FOR EACH ROW
BEGIN
  IF OLD.status IN ('closed','rejected') AND NEW.status <> OLD.status THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede reabrir una disputa cerrada o rechazada.';
  END IF;
END//
DELIMITER ;

-- Para cerrar, deben existir ≥2 acuerdos de actores distintos
DROP TRIGGER IF EXISTS trg_dispute_before_update_require_two_agreements;
DELIMITER //
CREATE TRIGGER trg_dispute_before_update_require_two_agreements
BEFORE UPDATE ON dispute
FOR EACH ROW
BEGIN
  DECLARE v_agreements INT;
  IF NEW.status = 'closed' AND OLD.status <> 'closed' THEN
    SELECT COUNT(DISTINCT de.actor_id) INTO v_agreements
      FROM dispute_event de
     WHERE de.dispute_id = OLD.id
       AND de.event_type = 'agreement';
    IF v_agreements < 2 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Se requieren dos acuerdos de actores distintos para cerrar.';
    END IF;
  END IF;
END//
DELIMITER ;

-- El actor de un evento debe ser participante de la conversación de la disputa
DROP TRIGGER IF EXISTS trg_de_before_insert_actor_is_participant;
DELIMITER //
CREATE TRIGGER trg_de_before_insert_actor_is_participant
BEFORE INSERT ON dispute_event
FOR EACH ROW
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM dispute d
      JOIN conversation_participant cp
        ON cp.conversation_id = d.conversation_id
       AND cp.user_id         = NEW.actor_id
     WHERE d.id = NEW.dispute_id
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El actor del evento no pertenece a la conversación de la disputa.';
  END IF;
END//
DELIMITER ;

-- Auditoría básica de cambios en mensajes, disputas y refunds
DROP TRIGGER IF EXISTS trg_msg_after_insert_audit;
DELIMITER //
CREATE TRIGGER trg_msg_after_insert_audit
AFTER INSERT ON message
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
  VALUES (NEW.sender_id, 'Message', NEW.id, 'create',
          JSON_OBJECT('conversation_id', NEW.conversation_id, 'type', NEW.type), NOW(3));
END//
DELIMITER ;

DROP TRIGGER IF EXISTS trg_msg_after_update_audit;
DELIMITER //
CREATE TRIGGER trg_msg_after_update_audit
AFTER UPDATE ON message
FOR EACH ROW
BEGIN
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
    VALUES (NEW.sender_id, 'Message', NEW.id, 'delete_soft',
            JSON_OBJECT('conversation_id', NEW.conversation_id), NOW(3));
  ELSE
    INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
    VALUES (NEW.sender_id, 'Message', NEW.id, 'update',
            JSON_OBJECT('conversation_id', NEW.conversation_id), NOW(3));
  END IF;
END//
DELIMITER ;

DROP TRIGGER IF EXISTS trg_dispute_after_update_audit_status;
DELIMITER //
CREATE TRIGGER trg_dispute_after_update_audit_status
AFTER UPDATE ON dispute
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
    VALUES (NEW.opener_id, 'Dispute', NEW.id, 'status_change',
            JSON_OBJECT('from', OLD.status, 'to', NEW.status, 'order_id', NEW.order_id), NOW(3));
  END IF;
END//
DELIMITER ;

DROP TRIGGER IF EXISTS trg_refund_after_update_audit_status;
DELIMITER //
CREATE TRIGGER trg_refund_after_update_audit_status
AFTER UPDATE ON refund
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
    VALUES (NULL, 'Refund', NEW.id, 'status_change',
            JSON_OBJECT('from', OLD.status, 'to', NEW.status, 'dispute_id', NEW.dispute_id, 'provider_ref', NEW.provider_ref), NOW(3));
  END IF;
END//
DELIMITER ;

-- =======================================================================
-- 4. Índices — lo que acelera las consultas que sí o sí harás
-- =======================================================================

-- Timeline de chat y paginación estable por cursor
CREATE INDEX idx_msg_conv_created_id       ON message (conversation_id, created_at ASC, id ASC);
CREATE INDEX idx_msg_conv_created_desc_id  ON message (conversation_id, created_at DESC, id DESC);

-- Inbox por usuario y por recencia
CREATE INDEX idx_conv_buyer_recency        ON conversation (buyer_id,  last_activity_at DESC, id DESC);
CREATE INDEX idx_conv_seller_recency       ON conversation (seller_id, last_activity_at DESC, id DESC);
CREATE INDEX idx_conv_last_activity_desc   ON conversation (last_activity_at DESC, id DESC);

-- Bandejas de disputa
CREATE INDEX idx_dispute_order_status      ON dispute (order_id, status, id);
CREATE INDEX idx_dispute_conv_status       ON dispute (conversation_id, status, id);
CREATE INDEX idx_dispute_status_updated    ON dispute (status, updated_at DESC, id DESC);

-- Conciliación de reembolsos
CREATE INDEX idx_refund_dispute            ON refund (dispute_id, id);
CREATE INDEX idx_refund_status_updated     ON refund (status, updated_at DESC, id DESC);

-- =======================================================================
-- 5. Versionado y semillas — datos mínimos para probar rápido
-- =======================================================================

SET @buyer := 101;   -- ajusta con IDs reales del Squad 4
SET @seller := 202;
SET @order := 1;

INSERT INTO conversation (order_id, buyer_id, seller_id, last_activity_at)
VALUES (@order, @buyer, @seller, NOW(3));
SET @conv_id := LAST_INSERT_ID();

INSERT IGNORE INTO conversation_participant (conversation_id, user_id, role)
VALUES (@conv_id, @buyer, 'buyer'), (@conv_id, @seller, 'seller');

-- 50 mensajes de demo alternando buyer/seller (sin WITH RECURSIVE)
INSERT INTO message (conversation_id, sender_id, sender_role, type, body, created_at)
SELECT
  @conv_id,
  IF(seq.n % 2 = 1, @buyer, @seller),
  IF(seq.n % 2 = 1, 'buyer', 'seller'),
  'text',
  CONCAT('Mensaje demo #', seq.n),
  NOW(3) - INTERVAL (50 - seq.n) SECOND
FROM (
  SELECT ones.n + tens.n * 10 + 1 AS n
  FROM (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS ones
  CROSS JOIN
       (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS tens
  ORDER BY n LIMIT 50
) AS seq;

-- =======================================================================
-- INSERT INTO dispute (conversation_id, order_id, opener_id, reason, descripcion, status, opened_at)
-- VALUES (@conv_id, @order, @buyer, 'damaged', 'texto de prueba xdeeeeeee' , 'in_review', NOW(3));
-- SET @disp_id := LAST_INSERT_ID();
-- INSERT INTO dispute_event (dispute_id, actor_id, event_type, payload, created_at)
-- VALUES (@disp_id, @buyer,  'agreement', JSON_OBJECT('note','Acepto reembolso parcial'), NOW(3)),
-- (@disp_id, @seller, 'agreement', JSON_OBJECT('note','Devuelvo 50%'), NOW(3));
-- INSERT INTO refund (dispute_id, amount_cents, currency, provider_ref, status, idempotency_key)
-- VALUES (@disp_id, 5000, 'CLP', NULL, 'pending', CONCAT('demo-', UUID()));
-- =======================================================================



-- =======================================================================
-- 6. Retención y privacidad — vistas “activas” y utilidades de limpieza
-- =======================================================================

-- Consultas que ignoran soft-delete
CREATE OR REPLACE VIEW v_conversation_active AS SELECT * FROM conversation WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW v_message_active      AS SELECT * FROM message WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW v_dispute_active      AS SELECT * FROM dispute WHERE deleted_at IS NULL;

-- Purga programable por ventanas de retención (24/36 meses)
DROP PROCEDURE IF EXISTS sp_purge_soft_deleted;
DELIMITER //
CREATE PROCEDURE sp_purge_soft_deleted()
BEGIN
  DELETE FROM message      WHERE deleted_at IS NOT NULL AND deleted_at < (NOW() - INTERVAL 24 MONTH);
  DELETE FROM dispute      WHERE deleted_at IS NOT NULL AND deleted_at < (NOW() - INTERVAL 36 MONTH);
  DELETE FROM conversation WHERE deleted_at IS NOT NULL AND deleted_at < (NOW() - INTERVAL 36 MONTH);
  DELETE FROM audit_log    WHERE created_at < (NOW() - INTERVAL 36 MONTH);
END//
DELIMITER ;

-- Export rápido de datos por usuario (para backend)
DROP PROCEDURE IF EXISTS sp_export_user_data;
DELIMITER //
CREATE PROCEDURE sp_export_user_data(IN p_user_id BIGINT UNSIGNED)
BEGIN
  SELECT c.* FROM conversation c
  JOIN conversation_participant cp ON cp.conversation_id = c.id
  WHERE cp.user_id = p_user_id;

  SELECT m.* FROM message m WHERE m.sender_id = p_user_id;
  SELECT d.* FROM dispute d WHERE d.opener_id = p_user_id;
END//
DELIMITER ;

-- Soft-delete masivo de mensajes propios en una conversación
DROP PROCEDURE IF EXISTS sp_soft_delete_user_messages;
DELIMITER //
CREATE PROCEDURE sp_soft_delete_user_messages(IN p_user_id BIGINT UNSIGNED, IN p_conversation_id BIGINT UNSIGNED)
BEGIN
  UPDATE message
     SET deleted_at = NOW(3)
   WHERE conversation_id = p_conversation_id
     AND sender_id       = p_user_id
     AND deleted_at IS NULL;
END//
DELIMITER ;

-- =======================================================================
-- 8. Adjuntos: escaneo e integridad — segura exposición de archivos
-- =======================================================================

-- Todo adjunto entra “pending”
DROP TRIGGER IF EXISTS trg_att_before_insert_force_pending;
DELIMITER //
CREATE TRIGGER trg_att_before_insert_force_pending
BEFORE INSERT ON attachment
FOR EACH ROW
BEGIN
  SET NEW.scan_status = 'pending';
END//
DELIMITER ;

-- Transiciones permitidas: pending → clean|infected
DROP TRIGGER IF EXISTS trg_att_before_update_validate_transition;
DELIMITER //
CREATE TRIGGER trg_att_before_update_validate_transition
BEFORE UPDATE ON attachment
FOR EACH ROW
BEGIN
  IF NOT (OLD.scan_status = 'pending' AND NEW.scan_status IN ('clean','infected'))
     AND NEW.scan_status <> OLD.scan_status THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Transición inválida de scan_status (solo pending → clean|infected).';
  END IF;
END//
DELIMITER ;

-- Si resulta “infected”: auditar y enviar a cuarentena lógica
DROP TRIGGER IF EXISTS trg_att_after_update_quarantine_and_audit;
DELIMITER //
CREATE TRIGGER trg_att_after_update_quarantine_and_audit
AFTER UPDATE ON attachment
FOR EACH ROW
BEGIN
  IF OLD.scan_status <> 'infected' AND NEW.scan_status = 'infected' THEN
    INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
    VALUES (NULL, 'Attachment', NEW.id, 'infected_detected',
            JSON_OBJECT('message_id', NEW.message_id, 'checksum', NEW.checksum, 'mime', NEW.mime, 'size_bytes', NEW.size_bytes),
            NOW(3));
    UPDATE attachment SET url_secure = '', storage_key = CONCAT('quarantine://', OLD.storage_key)
     WHERE id = NEW.id;
  END IF;
END//
DELIMITER ;

-- Solo se descargan adjuntos “clean”
CREATE OR REPLACE VIEW v_attachment_downloadable AS
SELECT * FROM attachment WHERE scan_status = 'clean';

-- Obtener URL segura, bloqueando si no está limpio
DROP PROCEDURE IF EXISTS sp_get_attachment_url;
DELIMITER //
CREATE PROCEDURE sp_get_attachment_url(IN p_attachment_id BIGINT UNSIGNED)
BEGIN
  DECLARE v_url VARCHAR(512); DECLARE v_status ENUM('pending','clean','infected');
  SELECT url_secure, scan_status INTO v_url, v_status FROM attachment WHERE id = p_attachment_id LIMIT 1;
  IF v_status IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Adjunto no existe.'; END IF;
  IF v_status <> 'clean' THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Adjunto no disponible: no está limpio.'; END IF;
  SELECT v_url AS url_secure;
END//
DELIMITER ;

-- Duplicados y anomalías por checksum
CREATE OR REPLACE VIEW v_attachment_duplicates AS
SELECT checksum, COUNT(*) dup_count, MIN(id) first_id, MAX(id) last_id
FROM attachment GROUP BY checksum HAVING COUNT(*) > 1;

CREATE OR REPLACE VIEW v_attachment_checksum_anomalies AS
SELECT a1.id id1, a2.id id2, a1.checksum, a1.size_bytes size1, a2.size_bytes size2, a1.mime mime1, a2.mime mime2
FROM attachment a1 JOIN attachment a2
  ON a1.checksum = a2.checksum AND a1.id < a2.id
WHERE (a1.size_bytes <> a2.size_bytes OR a1.mime <> a2.mime);

DROP PROCEDURE IF EXISTS sp_flag_duplicate_attachments;
DELIMITER //
CREATE PROCEDURE sp_flag_duplicate_attachments()
BEGIN
  INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
  SELECT NULL, 'Attachment', a2.id, 'duplicate_detected',
         JSON_OBJECT('checksum', a2.checksum, 'original_id', a1.id, 'size_bytes', a2.size_bytes, 'mime', a2.mime), NOW(3)
  FROM attachment a1
  JOIN attachment a2 ON a1.checksum = a2.checksum AND a1.size_bytes = a2.size_bytes AND a1.id < a2.id;
END//
DELIMITER ;

-- =======================================================================
-- 9. Rendimiento y escalabilidad — particionar/archivar cuando crezca
-- =======================================================================

SET @enable_partitioning := 0;  -- déjalo en 0 en dev

SET @sql := IF(@enable_partitioning=1,
'ALTER TABLE message
 PARTITION BY RANGE (TO_DAYS(created_at)) (
   PARTITION p_2025_01 VALUES LESS THAN (TO_DAYS(''2025-02-01'')),
   PARTITION p_2025_02 VALUES LESS THAN (TO_DAYS(''2025-03-01'')),
   PARTITION p_2025_03 VALUES LESS THAN (TO_DAYS(''2025-04-01'')),
   PARTITION p_9999_max VALUES LESS THAN MAXVALUE
 );',
'SELECT ''message partitioning skipped''');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

DROP PROCEDURE IF EXISTS sp_message_add_month_partition;
DELIMITER //
CREATE PROCEDURE sp_message_add_month_partition(p_month_start DATE)
BEGIN
  DECLARE p_name VARCHAR(32); DECLARE p_next DATE;
  SET p_name = DATE_FORMAT(p_month_start, 'p_%Y_%m');
  SET p_next = (p_month_start + INTERVAL 1 MONTH);
  SET @q = CONCAT(
    'ALTER TABLE message ADD PARTITION (PARTITION ', p_name,
    ' VALUES LESS THAN (TO_DAYS(''', DATE_FORMAT(p_next,'%Y-%m-01'), ''')))'
  );
  PREPARE stmt FROM @q; EXECUTE stmt; DEALLOCATE PREPARE stmt;
END//
DELIMITER ;

DROP TABLE IF EXISTS message_archive;
CREATE TABLE IF NOT EXISTS message_archive LIKE message;

DROP PROCEDURE IF EXISTS sp_archive_messages_before;
DELIMITER //
CREATE PROCEDURE sp_archive_messages_before(p_before DATETIME)
BEGIN
  START TRANSACTION;
    INSERT INTO message_archive SELECT * FROM message WHERE created_at < p_before;
    DELETE FROM message WHERE created_at < p_before;
  COMMIT;
END//
DELIMITER ;

CREATE OR REPLACE VIEW v_msg_first_page_sample AS
SELECT conversation_id, MIN(created_at) first_ts, MAX(created_at) last_ts, COUNT(*) rows_in_page
FROM (SELECT conversation_id, created_at FROM message ORDER BY created_at DESC LIMIT 2000) t
GROUP BY conversation_id;

-- =======================================================================
-- 10. Consistencia y resiliencia — transacciones e idempotencia
-- =======================================================================

-- Enviar mensaje y refrescar conversación de forma atómica
DROP PROCEDURE IF EXISTS sp_send_message;
DELIMITER //
CREATE PROCEDURE sp_send_message(
  IN p_conversation_id BIGINT UNSIGNED,
  IN p_sender_id       BIGINT UNSIGNED,
  IN p_sender_role     ENUM('buyer','seller','moderator'),
  IN p_type            ENUM('text','image'),
  IN p_body            TEXT
)
BEGIN
  START TRANSACTION;
    INSERT INTO message (conversation_id, sender_id, sender_role, type, body)
    VALUES (p_conversation_id, p_sender_id, p_sender_role, p_type, p_body);
    UPDATE conversation SET last_activity_at = NOW(3) WHERE id = p_conversation_id;
  COMMIT;
END//
DELIMITER ;

-- Crear refund de forma idempotente (mismo idempotency_key => misma fila)
DROP PROCEDURE IF EXISTS sp_create_refund_idempotent;
DELIMITER //
CREATE PROCEDURE sp_create_refund_idempotent(
  IN p_dispute_id     BIGINT UNSIGNED,
  IN p_amount_cents   INT UNSIGNED,
  IN p_currency       CHAR(3),
  IN p_provider_ref   VARCHAR(100),
  IN p_idem_key       VARCHAR(80)
)
BEGIN
  DECLARE v_id BIGINT UNSIGNED;
  SELECT id INTO v_id FROM refund WHERE idempotency_key = p_idem_key LIMIT 1;
  IF v_id IS NULL THEN
    INSERT INTO refund (dispute_id, amount_cents, currency, provider_ref, status, idempotency_key)
    VALUES (p_dispute_id, p_amount_cents, p_currency, p_provider_ref, 'pending', p_idem_key);
    SET v_id = LAST_INSERT_ID();
  END IF;
  SELECT * FROM refund WHERE id = v_id;
END//
DELIMITER ;

-- Registro de eventos de webhook para reintentos sin doble efecto
DROP TABLE IF EXISTS webhook_event_log;
CREATE TABLE IF NOT EXISTS webhook_event_log (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  source        VARCHAR(50) NOT NULL,
  event_id      VARCHAR(120) NOT NULL,
  received_at   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  metadata      JSON NULL,
  UNIQUE KEY uq_source_event (source, event_id)
) ENGINE=InnoDB;

DROP PROCEDURE IF EXISTS sp_process_refund_webhook;
DELIMITER //
CREATE PROCEDURE sp_process_refund_webhook(
  IN p_event_id     VARCHAR(120),
  IN p_dispute_id   BIGINT UNSIGNED,
  IN p_new_status   ENUM('pending','succeeded','failed'),
  IN p_provider_ref VARCHAR(100),
  IN p_metadata     JSON
)
BEGIN
  DECLARE v_dup BOOL DEFAULT FALSE;

  INSERT IGNORE INTO webhook_event_log (source, event_id, metadata)
  VALUES ('psp', p_event_id, p_metadata);

  IF ROW_COUNT() = 0 THEN
    SET v_dup = TRUE;
  END IF;

  IF v_dup THEN
    SELECT 'ignored: duplicate event' AS status;
  ELSE
    START TRANSACTION;
      UPDATE refund
         SET status = p_new_status,
             provider_ref = p_provider_ref,
             updated_at = NOW(3)
       WHERE dispute_id = p_dispute_id
         AND status <> p_new_status;
    COMMIT;
    SELECT 'ok' AS status;
  END IF;
END//
DELIMITER ;

-- =======================================================================
-- 12. Calidad de datos — vistas de anomalías y dataset de carga
-- =======================================================================

-- Mensajes que “saltan” el orden temporal
CREATE OR REPLACE VIEW v_message_order_anomalies AS
SELECT * FROM (
  SELECT m.id, m.conversation_id, m.created_at,
         LAG(m.created_at) OVER (PARTITION BY m.conversation_id ORDER BY m.created_at, m.id) AS prev_ts
  FROM message m
) x
WHERE prev_ts IS NOT NULL AND created_at < prev_ts;

-- Soft-delete que podría romper paginado estable
CREATE OR REPLACE VIEW v_soft_delete_order_warnings AS
SELECT m1.id AS deleted_id, m2.id AS visible_id, m1.conversation_id
FROM message m1
JOIN message m2 ON m1.conversation_id = m2.conversation_id
WHERE m1.deleted_at IS NOT NULL AND m2.deleted_at IS NULL AND m1.created_at > m2.created_at;

-- Disputas cerradas sin los 2 acuerdos requeridos (no debería suceder)
CREATE OR REPLACE VIEW v_dispute_closed_without_two_agreements AS
SELECT d.id dispute_id, d.status, COUNT(DISTINCT de.actor_id) agreements
FROM dispute d
LEFT JOIN dispute_event de ON de.dispute_id = d.id AND de.event_type = 'agreement'
WHERE d.status = 'closed'
GROUP BY d.id
HAVING COUNT(DISTINCT de.actor_id) < 2;

-- “Runner” de chequeos rápidos (entrega conteos)
DROP PROCEDURE IF EXISTS sp_run_integrity_checks;
DELIMITER //
CREATE PROCEDURE sp_run_integrity_checks()
BEGIN
  SELECT 'message_order_anomalies' AS check_name, COUNT(*) AS cnt FROM v_message_order_anomalies
  UNION ALL SELECT 'soft_delete_order_warnings', COUNT(*) FROM v_soft_delete_order_warnings
  UNION ALL SELECT 'dispute_closed_without_two_agreements', COUNT(*) FROM v_dispute_closed_without_two_agreements;
END//
DELIMITER ;

-- Generador masivo para pruebas de índices/latencias
DROP PROCEDURE IF EXISTS sp_seed_bulk_messages;
DELIMITER //
CREATE PROCEDURE sp_seed_bulk_messages(
  IN p_conv_id BIGINT UNSIGNED,
  IN p_sender_a BIGINT UNSIGNED,
  IN p_sender_b BIGINT UNSIGNED,
  IN p_n INT
)
BEGIN
  DECLARE i INT DEFAULT 1;
  START TRANSACTION;
  WHILE i <= p_n DO
    INSERT INTO message (conversation_id, sender_id, sender_role, type, body, created_at)
    VALUES (
      p_conv_id,
      IF(i % 2 = 1, p_sender_a, p_sender_b),
      IF(i % 2 = 1, 'buyer', 'seller'),
      'text',
      CONCAT('Bulk msg #', i),
      NOW(3) - INTERVAL (p_n - i) SECOND
    );
    SET i = i + 1;
  END WHILE;
  COMMIT;
END//
DELIMITER ;

-- =======================================================================
-- 13. Observabilidad — tamaños, uso de índices, locks y snapshots
-- =======================================================================

CREATE OR REPLACE VIEW v_table_sizes AS
SELECT t.TABLE_NAME,
       ROUND((t.DATA_LENGTH + t.INDEX_LENGTH)/1024/1024, 2) AS size_mb,
       t.TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES t
WHERE t.TABLE_SCHEMA = DATABASE()
  AND t.TABLE_NAME IN ('conversation','conversation_participant','message','attachment','dispute','dispute_event','refund','audit_log','message_archive')
ORDER BY size_mb DESC;

DROP VIEW IF EXISTS v_index_usage;
CREATE VIEW v_index_usage AS
SELECT OBJECT_SCHEMA,
       OBJECT_NAME AS table_name,
       INDEX_NAME,
       COUNT_STAR AS read_ops,
       CAST(SUM_TIMER_WAIT / 1e12 AS DECIMAL(18,6)) AS total_wait_s
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA = DATABASE()
  AND OBJECT_NAME IN ('conversation','conversation_participant','message','attachment','dispute','dispute_event','refund')
  AND INDEX_NAME IS NOT NULL;

CREATE OR REPLACE VIEW v_lock_waits AS
SELECT * FROM performance_schema.data_locks;

DROP TABLE IF EXISTS metrics_table_size_history;
CREATE TABLE IF NOT EXISTS metrics_table_size_history (
  captured_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  table_name  VARCHAR(64) NOT NULL,
  size_mb     DECIMAL(10,2) NOT NULL,
  rows_cnt    BIGINT UNSIGNED NOT NULL
) ENGINE=InnoDB;

DROP PROCEDURE IF EXISTS sp_snapshot_table_sizes;
DELIMITER //
CREATE PROCEDURE sp_snapshot_table_sizes()
BEGIN
  INSERT INTO metrics_table_size_history (captured_at, table_name, size_mb, rows_cnt)
  SELECT NOW(3), table_name, size_mb, table_rows FROM v_table_sizes;
END//
DELIMITER ;

DROP EVENT IF EXISTS ev_hourly_table_size_snapshot;
CREATE EVENT ev_hourly_table_size_snapshot
  ON SCHEDULE EVERY 1 HOUR
  DO CALL sp_snapshot_table_sizes();

-- (Server) Slow Query Log se habilita fuera del script:
--   SET GLOBAL slow_query_log = ON;
--   SET GLOBAL long_query_time = 0.5;

-- ==========================
-- FIN
-- ==========================
