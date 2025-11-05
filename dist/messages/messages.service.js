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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let MessagesService = class MessagesService {
    constructor(ds) {
        this.ds = ds;
    }
    async send(conversationId, senderId, role, body) {
        await this.ds.query(`CALL sp_send_message(?,?,?,?,?)`, [
            conversationId,
            senderId,
            role,
            'text',
            body,
        ]);
        return { ok: true };
    }
    async list(conversationId, after, limit = 50) {
        const params = [conversationId];
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
    async softDelete(messageId, actorId) {
        await this.ds.query(`UPDATE message
          SET deleted_at = NOW(3)
        WHERE id = ?
          AND deleted_at IS NULL`, [messageId]);
        await this.ds.query(`INSERT INTO audit_log (actor_id, entity, entity_id, action, created_at)
       VALUES (?,?,?,?, NOW(3))`, [actorId, 'Message', messageId, 'delete']);
        return { ok: true };
    }
    async getOne(messageId) {
        const rows = await this.ds.query(`SELECT id, conversation_id, sender_id, sender_role, type, body, created_at, deleted_at
         FROM message
        WHERE id = ?`, [messageId]);
        return rows?.[0] ?? null;
    }
    async flag(messageId, reason, actorId) {
        await this.ds.query(`INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
       VALUES (?,?,?,?, JSON_OBJECT('reason', ?), NOW(3))`, [actorId, 'Message', messageId, 'flag', reason ?? '']);
        return { ok: true };
    }
    async listFlagged(limit = 100) {
        return this.ds.query(`SELECT al.id       AS flag_id,
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
        LIMIT ?`, [limit]);
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MessagesService);
//# sourceMappingURL=messages.service.js.map