import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type MessageRole = 'buyer' | 'seller' | 'moderator';

@Injectable()
export class MessagesService {
  constructor(private readonly ds: DataSource) {}

  /**
   * HU3 — Enviar mensaje a una conversación
   * Usa el SP definido en el script SQL (crea el mensaje y actualiza last_activity_at).
   */
  async send(
    conversationId: number,
    senderId: number,
    role: MessageRole,
    body: string,
  ) {
    await this.ds.query(`CALL sp_send_message(?,?,?,?,?)`, [
      conversationId,
      senderId,
      role,
      'text',
      body,
    ]);
    return { ok: true };
  }

  /**
   * Timeline paginado por cursor (created_at, id).
   * Si pasas after.ts y after.id, continúa desde ese cursor.
   */
  async list(
    conversationId: number,
    after?: { ts: string; id: number },
    limit = 50,
  ) {
    const params: any[] = [conversationId];
    let sql = `SELECT id, sender_id, sender_role, type, body, created_at
                 FROM message
                WHERE conversation_id = ?
                  AND deleted_at IS NULL`;
    if (after?.ts && after?.id) {
      sql += ` AND (created_at > ? OR (created_at = ? AND id > ?))`;
      params.push(after.ts, after.ts, after.id);
    }
    sql += ` ORDER BY created_at ASC, id ASC LIMIT ?`;
    params.push(limit);
    return this.ds.query(sql, params);
  }

  /**
   * HU9 — Eliminación lógica de un mensaje.
   * Deja trazabilidad en audit_log.
   */
  async softDelete(messageId: number, actorId: number) {
    await this.ds.query(
      `UPDATE message
          SET deleted_at = NOW(3)
        WHERE id = ?
          AND deleted_at IS NULL`,
      [messageId],
    );

    // Trazabilidad (compatible con tu esquema de auditoría)
    await this.ds.query(
      `INSERT INTO audit_log (actor_id, entity, entity_id, action, created_at)
       VALUES (?,?,?,?, NOW(3))`,
      [actorId, 'Message', messageId, 'delete'],
    );

    return { ok: true };
  }

  /**
   * Utilidad opcional: obtener un mensaje por id (vigente, no borrado).
   */
  async getOne(messageId: number) {
    const rows = await this.ds.query(
      `SELECT id, conversation_id, sender_id, sender_role, type, body, created_at, deleted_at
         FROM message
        WHERE id = ?`,
      [messageId],
    );
    return rows?.[0] ?? null;
  }

  /** HU8 — Marcar un mensaje para moderación (razón libre) */
  async flag(messageId: number, reason: string, actorId: number) {
    await this.ds.query(
      `INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
       VALUES (?,?,?,?, JSON_OBJECT('reason', ?), NOW(3))`,
      [actorId, 'Message', messageId, 'flag', reason ?? ''],
    );
    return { ok: true };
  }

  /** HU8 — Listado de mensajes marcados a partir de audit_log */
  async listFlagged(limit = 100) {
    return this.ds.query(
      `SELECT al.id       AS flag_id,
              m.id        AS message_id,
              m.conversation_id,
              m.sender_id,
              m.body,
              JSON_EXTRACT(al.metadata, '$.reason') AS reason,
              al.created_at
         FROM audit_log al
         JOIN message   m ON m.id = al.entity_id
        WHERE al.entity = 'Message'
          AND al.action = 'flag'
        ORDER BY al.created_at DESC
        LIMIT ?`,
      [limit],
    );
  }

}

