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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let ConversationsService = class ConversationsService {
    constructor(ds) {
        this.ds = ds;
    }
    async create(buyerId, sellerId) {
        const sql = `
      INSERT INTO conversation (buyer_id, seller_id, last_activity_at)
      VALUES (?, ?, NOW(3))
    `;
        const res = await this.ds.query(sql, [buyerId, sellerId]);
        return { id: res.insertId, buyerId, sellerId };
    }
    async listByUser(userId) {
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
    async findById(id) {
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
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map