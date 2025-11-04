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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./schemas/message.schema");
async function canUserAccessOrder(orderId, userId) {
    return true;
}
let MessagesService = class MessagesService {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async sendMessage(dto, user) {
        const allowed = await canUserAccessOrder(dto.orderId, user.id);
        if (!allowed) {
            throw new common_1.ForbiddenException('No puedes enviar mensajes para esta orden');
        }
        const msg = await this.messageModel.create({
            orderId: dto.orderId,
            senderUserId: user.id,
            type: dto.type,
            body: dto.body ?? '',
            attachments: dto.attachments ?? [],
            status: 'sent',
        });
        return msg;
    }
    async getMessagesForOrder(orderId, query, user) {
        const allowed = await canUserAccessOrder(orderId, user.id);
        if (!allowed) {
            throw new common_1.ForbiddenException('No puedes ver los mensajes de esta orden');
        }
        const mongoQuery = {
            orderId,
        };
        if (query.cursor) {
            const cursorDate = new Date(query.cursor);
            if (!isNaN(cursorDate.valueOf())) {
                mongoQuery.createdAt = { $gt: cursorDate };
            }
        }
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const messages = await this.messageModel
            .find(mongoQuery)
            .sort({ createdAt: 1 })
            .limit(limit);
        return messages;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessagesService);
//# sourceMappingURL=messages.service.js.map