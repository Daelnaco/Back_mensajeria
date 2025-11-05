import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DisputesService {
  constructor(private readonly ds: DataSource) {}

  /**
   * Crea la disputa. Campos opcionales:
   *  - conversation_id (puede ser null)
   *  - order_id (puede ser null)
   *  - description (puede ser null)
   */
  async open(
    conversationId: number | null,
    openerId: number,
    reason: string,
    orderId: number | null,
    description: string | null,
  ) {
    try {
      const insertSql = `
        INSERT INTO dispute
          (conversation_id, order_id, opener_id, reason, descripcion, status, opened_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'open', NOW(), NOW())
      `;
      const params = [conversationId, orderId, openerId, reason, description];

      const result: any = await this.ds.query(insertSql, params);
      const id = result?.insertId;

      // Devolvemos con alias en camelCase para el FE
      const [row] = await this.ds.query(
        `
        SELECT
          d.id,
          d.status,
          d.reason,
          d.descripcion,
          d.conversation_id  AS conversationId,
          d.order_id         AS orderId,
          d.opener_id        AS openerId,
          d.opened_at        AS createdAt,
          d.updated_at       AS updatedAt,
          c.buyer_id         AS buyerId,
          c.seller_id        AS sellerId
        FROM dispute d
        LEFT JOIN conversation c ON c.id = d.conversation_id
        WHERE d.id = ?
        `,
        [id],
      );

      return row;
    } catch (e: any) {
      console.error(
        '[DisputesService.open] SQL error:',
        e?.sqlMessage || e?.message,
        { code: e?.code },
      );
      throw new InternalServerErrorException('Error al crear disputa');
    }
  }

  /**
   * Lista disputas. Si scope = 'mine' incluye:
   * - Disputas donde el usuario participa en la conversación (buyer/seller)
   * - Disputas abiertas por el usuario (opener_id) aunque no tengan conversación
   */
  async list({
    status,
    scope,
    uid,
  }: {
    status?: string;
    scope: 'mine' | 'all';
    uid: number;
  }) {
    try {
      const args: any[] = [];
      let sql = `
        SELECT
          d.id,
          d.status,
          d.reason,
          d.descripcion,
          d.conversation_id  AS conversationId,
          d.order_id         AS orderId,
          d.opener_id        AS openerId,
          d.opened_at        AS createdAt,
          d.updated_at       AS updatedAt,
          c.buyer_id         AS buyerId,
          c.seller_id        AS sellerId
        FROM dispute d
        LEFT JOIN conversation c ON c.id = d.conversation_id
        WHERE d.deleted_at IS NULL
      `;

      if (scope !== 'all') {
        // incluye disputas sin conversación creadas por el usuario
        sql += ' AND (c.buyer_id = ? OR c.seller_id = ? OR d.opener_id = ?)';
        args.push(uid, uid, uid);
      }

      if (status) {
        sql += ' AND d.status = ?';
        args.push(status);
      }

      sql += ' ORDER BY d.updated_at DESC LIMIT 100';

      return await this.ds.query(sql, args);
    } catch (e: any) {
      console.error(
        '[DisputesService.list] SQL error:',
        e?.sqlMessage || e?.message,
        { code: e?.code },
      );
      throw new InternalServerErrorException('Error al listar disputas');
    }
  }

  async findById(id: number) {
    try {
      const [row] = await this.ds.query(
        `
        SELECT
          d.id,
          d.status,
          d.reason,
          d.descripcion,
          d.conversation_id  AS conversationId,
          d.order_id         AS orderId,
          d.opener_id        AS openerId,
          d.opened_at        AS createdAt,
          d.updated_at       AS updatedAt,
          c.buyer_id         AS buyerId,
          c.seller_id        AS sellerId
        FROM dispute d
        LEFT JOIN conversation c ON c.id = d.conversation_id
        WHERE d.id = ?
        `,
        [id],
      );
      return row;
    } catch (e: any) {
      console.error(
        '[DisputesService.findById] SQL error:',
        e?.sqlMessage || e?.message,
        { code: e?.code },
      );
      throw new InternalServerErrorException('Error al obtener disputa');
    }
  }

  // Stubs mínimos para que el controller compile
  async reply(
    id: number,
    userId: number,
    eventType?: string,
    note?: string,
    payload?: any,
  ) {
    return { ok: true, id, userId, eventType, note, payload };
  }

  async close(id: number) {
    return { ok: true, id };
  }

  async events(id: number) {
    return [];
  }
}
