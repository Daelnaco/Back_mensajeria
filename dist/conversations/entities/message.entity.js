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
exports.ConversationMessage = void 0;
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
let ConversationMessage = class ConversationMessage {
};
exports.ConversationMessage = ConversationMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConversationMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, { onDelete: 'CASCADE' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], ConversationMessage.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'sender_id' }),
    __metadata("design:type", Number)
], ConversationMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], ConversationMessage.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ConversationMessage.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], ConversationMessage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], ConversationMessage.prototype, "imageCaption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, default: 'sent' }),
    __metadata("design:type", String)
], ConversationMessage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ConversationMessage.prototype, "creadoEn", void 0);
exports.ConversationMessage = ConversationMessage = __decorate([
    (0, typeorm_1.Entity)('conversation_messages')
], ConversationMessage);
//# sourceMappingURL=message.entity.js.map