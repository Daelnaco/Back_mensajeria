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
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const conversations_service_1 = require("./conversations.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ConversationsController = class ConversationsController {
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async startConversationAndSend(dto, req) {
        return this.conversationsService.sendMessageInConversation(dto, req.user);
    }
    async myConversations(req) {
        return this.conversationsService.listMyConversations(req.user.id);
    }
    async getByOrder(orderId, req) {
        return this.conversationsService.getConversationByOrder(orderId, req.user.id);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Iniciar conversación (o reutilizar) y enviar mensaje inicial',
        description: 'Crea la conversación entre el usuario actual y otherUserId para una orden dada, ' +
            'o reutiliza la existente si ya existe, y guarda el mensaje.',
    }),
    (0, swagger_1.ApiBody)({ type: create_message_dto_1.ConversationCreateMessageDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Mensaje enviado en la conversación' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'El usuario no tiene permiso para iniciar conversación',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.ConversationCreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "startConversationAndSend", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar mis conversaciones',
        description: 'Devuelve las conversaciones en las que participa el usuario autenticado, ' +
            'ordenadas por última actividad.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Conversaciones obtenidas' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "myConversations", null);
__decorate([
    (0, common_1.Get)('by-order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener conversación por orderId',
        description: 'Devuelve la conversación asociada a esa orden si el usuario participa.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Conversación encontrada' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'No existe conversación para esta orden' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getByOrder", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, swagger_1.ApiTags)('Conversaciones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
//# sourceMappingURL=conversations.controller.js.map