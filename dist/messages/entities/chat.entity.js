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
exports.Chat = void 0;
const typeorm_1 = require("typeorm");
let Chat = class Chat {
};
exports.Chat = Chat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_chat' }),
    __metadata("design:type", Number)
], Chat.prototype, "idChat", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_comprador', nullable: true }),
    __metadata("design:type", Number)
], Chat.prototype, "idComprador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_vendedor', nullable: true }),
    __metadata("design:type", Number)
], Chat.prototype, "idVendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'contenido' }),
    __metadata("design:type", String)
], Chat.prototype, "contenido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'fecha_mensaje', nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "fechaMensaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'sender_id', nullable: true }),
    __metadata("design:type", Number)
], Chat.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'order_id', nullable: true }),
    __metadata("design:type", Number)
], Chat.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'post_id', nullable: true }),
    __metadata("design:type", Number)
], Chat.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', name: 'is_visible', default: () => '1' }),
    __metadata("design:type", Boolean)
], Chat.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', name: 'is_flagged', default: () => '0' }),
    __metadata("design:type", Boolean)
], Chat.prototype, "isFlagged", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', name: 'is_deleted', default: () => '0' }),
    __metadata("design:type", Boolean)
], Chat.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Chat.prototype, "createdAt", void 0);
exports.Chat = Chat = __decorate([
    (0, typeorm_1.Entity)('chat')
], Chat);
//# sourceMappingURL=chat.entity.js.map