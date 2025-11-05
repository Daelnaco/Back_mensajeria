import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ConversationsService {
  constructor(private readonly ds: DataSource) {}

  // Crear una conversación
  async create(buyerId: number, sellerId: number) {
    const sql = `
      INSERT INTO conversation (buyer_id, seller_id, last_activity_at)
      VALUES (?, ?, NOW(3))
    `;
    const res: any = await this.ds.query(sql, [buyerId, sellerId]);
    return { id: res.insertId, buyerId, sellerId };
  }

  // Listar conversaciones (inbox)
  async listByUser(userId: number) {
    const sql = `
      SELECT c.id, c.buyer_id, c.seller_id, c.last_activity_at,
             u.nombre_usuario AS other_party
        FROM conversation c
        JOIN perfiles u
          ON u.id_usuario = IF(c.buyer_id = ?, c.seller_id, c.buyer_id)
       WHERE c.buyer_id = ? OR c.seller_id = ?
       ORDER BY c.last_activity_at DESC
    `;
    return this.ds.query(sql, [userId, userId, userId]);
  }

  // Obtener una conversación específica
  async findById(id: number) {
    const sql = `
      SELECT c.*, pb.nombre_usuario AS buyer_name, ps.nombre_usuario AS seller_name
      FROM conversation c
      LEFT JOIN perfiles pb ON pb.id_usuario = c.buyer_id
      LEFT JOIN perfiles ps ON ps.id_usuario = c.seller_id
      WHERE c.id = ?
    `;
    const rows = await this.ds.query(sql, [id]);
    return rows[0] ?? null;
  }
}
