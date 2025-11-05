"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let DisputesService = class DisputesService {
    constructor(ds) {
        this.ds = ds;
    }
    async open(conversationId, openerId, reason, orderId, description) {
        try {
            const insertSql = `
        INSERT INTO dispute
          (conversation_id, order_id, opener_id, reason, descripcion, status, opened_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'open', NOW(), NOW())
      `;
            const params = [conversationId, orderId, openerId, reason, description];
            const result = await this.ds.query(insertSql, params);
            const id = result?.insertId;
            const [row] = await this.ds.query(`
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
        `, [id]);
            return row;
        }
        catch (e) {
            console.error('[DisputesService.open] SQL error:', e?.sqlMessage || e?.message, { code: e?.code });
            throw new common_1.InternalServerErrorException('Error al crear disputa');
        }
    }
    async list({ status, scope, uid, }) {
        try {
            const args = [];
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
                sql += ' AND (c.buyer_id = ? OR c.seller_id = ? OR d.opener_id = ?)';
                args.push(uid, uid, uid);
            }
            if (status) {
                sql += ' AND d.status = ?';
                args.push(status);
            }
            sql += ' ORDER BY d.updated_at DESC LIMIT 100';
            return await this.ds.query(sql, args);
        }
        catch (e) {
            console.error('[DisputesService.list] SQL error:', e?.sqlMessage || e?.message, { code: e?.code });
            throw new common_1.InternalServerErrorException('Error al listar disputas');
        }
    }
    async findById(id) {
        try {
            const [row] = await this.ds.query(`
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
        `, [id]);
            return row;
        }
        catch (e) {
            console.error('[DisputesService.findById] SQL error:', e?.sqlMessage || e?.message, { code: e?.code });
            throw new common_1.InternalServerErrorException('Error al obtener disputa');
        }
    }
    async reply(id, userId, eventType, note, payload) {
        return { ok: true, id, userId, eventType, note, payload };
    }
    async close(id) {
        return { ok: true, id };
    }
    async events(id) {
        return [];
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map