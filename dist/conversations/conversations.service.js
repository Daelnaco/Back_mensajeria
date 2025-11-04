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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("./schemas/conversation.schema");
const message_schema_1 = require("../messages/schemas/message.schema");
function userAllowedForOrder(orderId, userId) {
    return true;
}
let ConversationsService = class ConversationsService {
    constructor(conversationModel, messageModel) {
        this.conversationModel = conversationModel;
        this.messageModel = messageModel;
    }
    async sendMessageInConversation(dto, senderUser) {
        if (!userAllowedForOrder(dto.orderId, senderUser.id)) {
            throw new common_1.ForbiddenException('No puedes iniciar conversación sobre esta orden');
        }
        const [userAId, userBId] = senderUser.id < dto.otherUserId
            ? [senderUser.id, dto.otherUserId]
            : [dto.otherUserId, senderUser.id];
        let conversation = await this.conversationModel.findOne({
            orderId: dto.orderId,
            userAId,
            userBId,
        });
        const now = new Date();
        if (!conversation) {
            conversation = await this.conversationModel.create({
                orderId: dto.orderId,
                userAId,
                userBId,
                lastActivityAt: now,
            });
        }
        const msg = await this.messageModel.create({
            orderId: dto.orderId,
            senderUserId: senderUser.id,
            type: dto.type,
            body: dto.body ?? '',
            attachments: dto.attachments ?? [],
            status: 'sent',
        });
        conversation.lastActivityAt = now;
        await conversation.save();
        return {
            conversationId: conversation._id.toString(),
            message: msg,
        };
    }
    async listMyConversations(userId) {
        const conversations = await this.conversationModel
            .find({
            $or: [{ userAId: userId }, { userBId: userId }],
        })
            .sort({ lastActivityAt: -1 });
        return conversations;
    }
    async getConversationByOrder(orderId, userId) {
        const convo = await this.conversationModel.findOne({
            orderId,
            $or: [{ userAId: userId }, { userBId: userId }],
        });
        if (!convo) {
            throw new common_1.NotFoundException('Conversación no encontrada');
        }
        return convo;
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map