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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async sendMessage(orderId, body, req) {
        const dto = {
            ...body,
            orderId,
        };
        return this.messagesService.sendMessage(dto, req.user);
    }
    async getMessages(orderId, query, req) {
        return this.messagesService.getMessagesForOrder(orderId, query, req.user);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)('order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Enviar mensaje en el chat de una orden',
        description: 'Crea un mensaje (texto o imagen) asociado a una orden específica. ' +
            'Valida que el usuario pueda hablar de esa orden y deja estado "sent".',
    }),
    (0, swagger_1.ApiBody)({ type: create_message_dto_1.CreateMessageDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Mensaje enviado' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'El usuario no tiene permiso sobre esta orden',
    }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener mensajes de la orden (chat)',
        description: 'Devuelve mensajes cronológicos (ASC) de la orden dada. ' +
            'Soporta paginación por cursor (fecha) y límite de resultados.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Mensajes obtenidos' }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'El usuario no tiene permiso sobre esta orden',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        description: 'ISO date. Entrega solo mensajes creados DESPUÉS de esa fecha.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Cantidad máxima de mensajes. Default 20.',
    }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_messages_dto_1.GetMessagesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessages", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Mensajes (HU-03)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map