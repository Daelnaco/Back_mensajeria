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
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AttachmentsService = class AttachmentsService {
    constructor(ds) {
        this.ds = ds;
    }
    async upload(dto, actorId) {
        const [msg] = await this.ds.query(`SELECT m.id, m.conversation_id, m.sender_id, m.type,
              c.buyer_id, c.seller_id
         FROM message m
         JOIN conversation c ON c.id = m.conversation_id
        WHERE m.id = ? AND m.deleted_at IS NULL`, [dto.messageId]);
        if (!msg)
            throw new common_1.BadRequestException('Mensaje no existe o fue eliminado');
        const isParticipant = (msg.buyer_id === actorId) || (msg.seller_id === actorId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('No participa en la conversación');
        await this.ds.query(`INSERT INTO attachment
         (message_id, mime, size_bytes, storage_key, url_secure, scan_status, checksum, created_at)
       VALUES (?,?,?,?,?,'pending',?, NOW(3))`, [dto.messageId, dto.mime, dto.sizeBytes, dto.storageKey, dto.urlSecure, dto.checksum]);
        await this.ds.query(`INSERT INTO audit_log (actor_id, entity, entity_id, action, metadata, created_at)
       VALUES (?,?,?,?, JSON_OBJECT('mime', ?, 'size', ?), NOW(3))`, [actorId, 'Attachment', dto.messageId, 'create', dto.mime, dto.sizeBytes]);
        return { ok: true };
    }
    async secureUrl(id) {
        const rows = await this.ds.query(`SELECT url_secure
         FROM attachment
        WHERE id = ? AND scan_status = 'clean'`, [id]);
        if (!rows?.length) {
            throw new common_1.ForbiddenException('Adjunto no disponible (pendiente o bloqueado)');
        }
        return rows[0];
    }
    async setAntivirusStatus(id, status) {
        await this.ds.query(`UPDATE attachment SET scan_status = ? WHERE id = ?`, [status, id]);
        return { ok: true };
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map