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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("./entities/chat.entity");
let MessagesService = class MessagesService {
    constructor(chats) {
        this.chats = chats;
        this.forbiddenWords = ['spam', 'insulto', 'grosería'];
    }
    async create(createMessageDto, user) {
        let isVisible = true;
        let isFlagged = false;
        if (this.forbiddenWords.some((w) => (createMessageDto.content ?? '').toLowerCase().includes(w))) {
            isVisible = false;
            isFlagged = true;
        }
        const entity = this.chats.create({
            contenido: createMessageDto.content,
            senderId: Number(user.id),
            orderId: createMessageDto.orderId ? Number(createMessageDto.orderId) : null,
            postId: createMessageDto.postId ? Number(createMessageDto.postId) : null,
            isVisible,
            isFlagged,
            isDeleted: false,
        });
        return this.chats.save(entity);
    }
    async findFlagged() {
        return this.chats.find({
            where: { isFlagged: true },
            order: { createdAt: 'DESC' },
        });
    }
    async softDelete(id, user) {
        const idNum = Number(id);
        const message = await this.chats.findOne({ where: { idChat: idNum } });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const isOwner = Number(message.senderId) === Number(user.id);
        const isAdmin = user?.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        message.isDeleted = true;
        await this.chats.save(message);
        return { success: true };
    }
    async findAll(user) {
        const isAdmin = user?.role === 'admin';
        if (isAdmin) {
            return this.chats.find({ order: { createdAt: 'DESC' } });
        }
        return this.chats.find({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
        });
    }
    async findByOrder(orderId) {
        return this.chats.find({
            where: {
                orderId: Number(orderId),
                isDeleted: false,
                isVisible: true,
            },
            order: { createdAt: 'ASC' },
        });
    }
    async findByPost(postId) {
        return this.chats.find({
            where: {
                postId: Number(postId),
                isDeleted: false,
                isVisible: true,
            },
            order: { createdAt: 'ASC' },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map