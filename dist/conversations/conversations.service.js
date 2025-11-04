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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
let ConversationsService = class ConversationsService {
    constructor(convRepo, msgRepo) {
        this.convRepo = convRepo;
        this.msgRepo = msgRepo;
    }
    async assertMembership(conversationId, userId) {
        const c = await this.convRepo.findOne({ where: { id: conversationId } });
        if (!c)
            throw new common_1.NotFoundException('Conversación no existe');
        if (![c.buyerId, c.sellerId].includes(userId)) {
            throw new common_1.ForbiddenException('No perteneces a esta conversación');
        }
        return c;
    }
    async postMessage(conversationId, dto, user) {
        const conv = await this.assertMembership(conversationId, Number(user.id));
        if (!conv.idPedido && !conv.idPublicacion) {
            throw new common_1.BadRequestException('Conversación debe estar ligada a pedido o publicación');
        }
        if (dto.type === 'text' && !dto.body) {
            throw new common_1.BadRequestException('Mensaje de texto sin body');
        }
        if (dto.type === 'image' && !dto.imageUrl) {
            throw new common_1.BadRequestException('Mensaje de imagen sin URL');
        }
        const entity = this.msgRepo.create({
            conversation: conv,
            senderId: Number(user.id),
            type: dto.type,
            body: dto.body,
            imageUrl: dto.imageUrl,
            imageCaption: dto.imageCaption,
            status: 'sent',
        });
        const saved = await this.msgRepo.save(entity);
        await this.convRepo.update({ id: conv.id }, { actualizadoEn: new Date() });
        return saved;
    }
    async listMessages(conversationId, user, cursor, limit = 20) {
        await this.assertMembership(conversationId, Number(user.id));
        const whereBase = { conversation: { id: conversationId } };
        const where = cursor ? { ...whereBase, creadoEn: (0, typeorm_2.MoreThan)(new Date(cursor)) } : whereBase;
        return this.msgRepo.find({
            where,
            order: { creadoEn: 'ASC' },
            take: Math.min(limit, 100),
        });
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.ConversationMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map