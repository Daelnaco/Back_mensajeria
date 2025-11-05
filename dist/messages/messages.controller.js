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
exports.MessagesModerationController = exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const update_message_dto_1 = require("./dto/update-message.dto");
let MessagesController = class MessagesController {
    constructor(svc) {
        this.svc = svc;
    }
    send(cid, req, dto) {
        return this.svc.send(+cid, req.user.id, dto.role, dto.body);
    }
    list(cid, afterTs, afterId) {
        const after = afterTs && afterId ? { ts: afterTs, id: parseInt(afterId, 10) } : undefined;
        return this.svc.list(+cid, after);
    }
    remove(messageId, req) {
        return this.svc.softDelete(+messageId, req.user.id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar mensaje' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mensaje enviado' }),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mensajes (paginación por cursor)' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'afterTs', required: false, description: 'ISO datetime' }),
    (0, swagger_1.ApiQuery)({ name: 'afterId', required: false, type: Number }),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Query)('afterTs')),
    __param(2, (0, common_1.Query)('afterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)('/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminación lógica de mensaje' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', type: Number }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "remove", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('conversations/:conversationId/messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
let MessagesModerationController = class MessagesModerationController {
    constructor(svc) {
        this.svc = svc;
    }
    flag(id, req, dto) {
        return this.svc.flag(+id, dto.reason, req.user.id);
    }
    flagged(limit) {
        return this.svc.listFlagged(limit ? parseInt(limit, 10) : 100);
    }
};
exports.MessagesModerationController = MessagesModerationController;
__decorate([
    (0, common_1.Post)(':id/flag'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar mensaje para moderación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesModerationController.prototype, "flag", null);
__decorate([
    (0, common_1.Get)('flagged'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mensajes marcados (moderación)' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagesModerationController.prototype, "flagged", null);
exports.MessagesModerationController = MessagesModerationController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesModerationController);
//# sourceMappingURL=messages.controller.js.map