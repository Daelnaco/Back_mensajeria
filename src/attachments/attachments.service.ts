import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AttachmentsService {
  constructor(private readonly ds: DataSource) {}

  /**
   * Registra la metadata del adjunto en estado 'pending'.
   * Valida que el mensaje exista y pertenezca a la conversación del usuario.
   */
  async upload(dto: {
    messageId: number; mime: string; sizeBytes: number;
    storageKey: string; urlSecure: string; checksum: string;
  }, actorId: number) {

    // 1) validar mensaje y pertenencia del actor a la conversación
    const [msg] = await this.ds.query(
      `SELECT m.id, m.conversation_id, m.sender_id, m.type,
              c.buyer_id, c.seller_id
         FROM message m
         JOIN conversation c ON c.id = m.conversation_id
        WHERE m.id = ? AND m.deleted_at IS NULL`,
      [dto.messageId],
    );
    if (!msg) throw new BadRequestException('Mensaje no existe o fue eliminado');

    const isParticipant = (msg.buyer_id === actorId) || (msg.seller_id === actorId);
    if (!isParticipant) throw new ForbiddenException('No participa en la conversación');

    // 2) opcional: exigir que el mensaje sea tipo 'image'
    // if (msg.type !== 'image') throw new BadRequestException('El mensaje no es de tipo imagen');

    // 3) crear attachment en estado pending
    await this.ds.query(
      `INSERT INTO attachment
         (message_id, mime, size_bytes, storage_key, url_secure, scan_status, checksum, created_at)
       VALUES (?,?,?,?,?,'pending',?, NOW(3))`,
      [dto.messageId, dto.mime, dto.sizeBytes, dto.storageKey, dto.urlSecure, dto.checksum],
    );

    // 4) traza
    await this.ds.query(
      `INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
       VALUES (?,?,?,?, JSON_OBJECT('mime', ?, 'size', ?), NOW(3))`,
      [actorId, 'Attachment', dto.messageId, 'create', dto.mime, dto.sizeBytes],
    );

    return { ok: true };
  }

  /**
   * Devuelve la URL segura si el adjunto está limpio (scan_status='clean').
   * Implementa el mismo comportamiento que el SP sp_get_attachment_url del .sql.
   */
  async secureUrl(id: number) {
    const rows = await this.ds.query(
      `SELECT url_secure
         FROM attachment
        WHERE id = ? AND scan_status = 'clean'`,
      [id],
    );
    if (!rows?.length) {
      throw new ForbiddenException('Adjunto no disponible (pendiente o bloqueado)');
    }
    return rows[0];
  }

  /**
   * (DEV/QA) Actualiza el estado antivirus de un adjunto.
   * En prod lo haría un worker o webhook del antivirus.
   */
  async setAntivirusStatus(id: number, status: 'clean'|'infected') {
    await this.ds.query(
      `UPDATE attachment SET scan_status = ? WHERE id = ?`,
      [status, id],
    );
    return { ok: true };
  }
}
