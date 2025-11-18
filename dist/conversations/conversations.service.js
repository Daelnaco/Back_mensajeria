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
const event_emitter_1 = require("@nestjs/event-emitter");
const role_enum_1 = require("../common/enums/role.enum");
const conversation_repository_1 = require("./repositories/conversation.repository");
let ConversationsService = class ConversationsService {
    constructor(conversationRepository, messageRepository, eventEmitter) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.eventEmitter = eventEmitter;
    }
    async getOrCreateConversation(currentUserId, role, payload) {
        var _a;
        if (currentUserId === payload.otherUserId) {
            throw new common_1.ForbiddenException('No puedes crear una conversacion contigo mismo');
        }
        const { buyerId, sellerId } = this.resolveParticipants(currentUserId, role, payload.otherUserId);
        const orderId = (_a = payload.orderId) !== null && _a !== void 0 ? _a : null;
        const existing = await this.conversationRepository.findExistingConversation(buyerId, sellerId, orderId);
        if (existing) {
            return existing;
        }
        const conversation = await this.conversationRepository.create({
            buyerId,
            sellerId,
            orderId,
        });
        this.eventEmitter.emit('conversation.created', conversation);
        return conversation;
    }
    async listUserConversations(userId, pagination) {
        return this.conversationRepository.listUserConversations(userId, pagination);
    }
    async listMessages(conversationId, userId, pagination) {
        const conversation = await this.conversationRepository.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('La conversacion no existe');
        }
        this.ensureParticipant(conversation, userId);
        return this.messageRepository.findByConversation(conversationId, pagination);
    }
    async sendMessage(conversationId, userId, payload) {
        var _a;
        const conversation = await this.conversationRepository.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('La conversacion no existe');
        }
        this.ensureParticipant(conversation, userId);
        const senderRole = conversation.buyerId === userId ? role_enum_1.Role.BUYER : role_enum_1.Role.SELLER;
        const message = await this.messageRepository.create({
            conversationId,
            senderId: userId,
            senderRole,
            type: 'text',
            text: payload.text,
            attachments: (_a = payload.attachments) !== null && _a !== void 0 ? _a : [],
        });
        this.eventEmitter.emit('conversation.message.created', {
            conversationId,
            senderId: userId,
            buyerId: conversation.buyerId,
            sellerId: conversation.sellerId,
        });
        return message;
    }
    ensureParticipant(conversation, userId) {
        if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
            throw new common_1.ForbiddenException('No perteneces a esta conversacion');
        }
    }
    resolveParticipants(currentUserId, role, otherUserId) {
        if (role === role_enum_1.Role.BUYER) {
            return { buyerId: currentUserId, sellerId: otherUserId };
        }
        if (role === role_enum_1.Role.SELLER) {
            return { buyerId: otherUserId, sellerId: currentUserId };
        }
        throw new common_1.ForbiddenException('Rol no soportado para iniciar conversaciones');
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(conversation_repository_1.CONVERSATION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(conversation_repository_1.CONVERSATION_MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, event_emitter_1.EventEmitter2])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map