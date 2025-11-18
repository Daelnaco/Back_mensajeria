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
exports.ConversationMessageMysqlRepository = exports.ConversationMysqlRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_message_orm_entity_1 = require("./conversation-message.orm-entity");
const conversation_orm_entity_1 = require("./conversation.orm-entity");
let ConversationMysqlRepository = class ConversationMysqlRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findExistingConversation(buyerId, sellerId, orderId) {
        const where = {
            buyerId,
            sellerId,
            orderId: orderId !== null && orderId !== void 0 ? orderId : (0, typeorm_2.IsNull)(),
        };
        const conversation = await this.repository.findOne({ where });
        return conversation ? this.toDomain(conversation) : null;
    }
    async create(conversation) {
        var _a;
        const entity = this.repository.create({
            buyerId: conversation.buyerId,
            sellerId: conversation.sellerId,
            orderId: (_a = conversation.orderId) !== null && _a !== void 0 ? _a : null,
        });
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async findById(id) {
        const conversation = await this.repository.findOne({ where: { id } });
        return conversation ? this.toDomain(conversation) : null;
    }
    async listUserConversations(userId, pagination) {
        var _a, _b, _c, _d;
        const qb = this.repository.createQueryBuilder('conversation');
        qb.where('conversation.buyerId = :userId OR conversation.sellerId = :userId', { userId });
        qb.orderBy('conversation.lastActivityAt', 'DESC');
        qb.skip((_a = pagination.skip) !== null && _a !== void 0 ? _a : 0).take((_b = pagination.limit) !== null && _b !== void 0 ? _b : 20);
        const [rows, total] = await qb.getManyAndCount();
        return {
            data: rows.map((row) => this.toDomain(row)),
            total,
            skip: (_c = pagination.skip) !== null && _c !== void 0 ? _c : 0,
            limit: (_d = pagination.limit) !== null && _d !== void 0 ? _d : 20,
        };
    }
    toDomain(entity) {
        return {
            id: entity.id,
            buyerId: entity.buyerId,
            sellerId: entity.sellerId,
            orderId: entity.orderId,
            lastActivityAt: entity.lastActivityAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
        };
    }
};
exports.ConversationMysqlRepository = ConversationMysqlRepository;
exports.ConversationMysqlRepository = ConversationMysqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_orm_entity_1.ConversationOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConversationMysqlRepository);
let ConversationMessageMysqlRepository = class ConversationMessageMysqlRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(message) {
        var _a;
        const entity = this.repository.create({
            conversationId: message.conversationId,
            senderId: message.senderId,
            senderRole: message.senderRole,
            type: message.type,
            body: (_a = message.text) !== null && _a !== void 0 ? _a : null,
        });
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async findByConversation(conversationId, pagination) {
        var _a, _b, _c, _d;
        const [rows, total] = await this.repository.findAndCount({
            where: { conversationId },
            order: { createdAt: 'ASC' },
            skip: (_a = pagination.skip) !== null && _a !== void 0 ? _a : 0,
            take: (_b = pagination.limit) !== null && _b !== void 0 ? _b : 20,
        });
        return {
            data: rows.map((row) => this.toDomain(row)),
            total,
            skip: (_c = pagination.skip) !== null && _c !== void 0 ? _c : 0,
            limit: (_d = pagination.limit) !== null && _d !== void 0 ? _d : 20,
        };
    }
    toDomain(entity) {
        var _a;
        return {
            id: entity.id,
            conversationId: entity.conversationId,
            senderId: entity.senderId,
            senderRole: entity.senderRole,
            type: entity.type,
            text: (_a = entity.body) !== null && _a !== void 0 ? _a : '',
            attachments: [],
            createdAt: entity.createdAt,
            editedAt: entity.editedAt,
            deletedAt: entity.deletedAt,
        };
    }
};
exports.ConversationMessageMysqlRepository = ConversationMessageMysqlRepository;
exports.ConversationMessageMysqlRepository = ConversationMessageMysqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_message_orm_entity_1.ConversationMessageOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConversationMessageMysqlRepository);
//# sourceMappingURL=conversation.mysql.repository.js.map