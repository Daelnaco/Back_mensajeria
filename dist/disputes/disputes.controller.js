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
exports.DisputesController = void 0;
const common_1 = require("@nestjs/common");
const disputes_service_1 = require("./disputes.service");
const create_dispute_dto_1 = require("./dto/create-dispute.dto");
const reply_dispute_dto_1 = require("./dto/reply-dispute.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let DisputesController = class DisputesController {
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    async openDispute(dto, req) {
        return this.disputesService.openDispute(dto, req.user, req.ip, req.headers['user-agent'] || '');
    }
    async myDisputes(req) {
        return this.disputesService.findAllByUser(req.user.id);
    }
    async reply(disputeId, dto, req) {
        return this.disputesService.replyToDispute(disputeId, dto, req.user);
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear disputa',
        description: 'Crea una disputa asociada a una orden/publicación. ' +
            'Valida que la orden pertenezca al usuario autenticado y que no haya otra disputa abierta. ' +
            'El campo `orderId` proviene del módulo de compras/carrito del Squad 5 (Carritos de compra). ' +
            'Sin esa integración final real, se está usando una validación simulada.',
    }),
    (0, swagger_1.ApiBody)({ type: create_dispute_dto_1.CreateDisputeDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Disputa creada exitosamente' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Ya existe disputa abierta' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Orden no pertenece al usuario' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dispute_dto_1.CreateDisputeDto, Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "openDispute", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar disputas propias',
        description: 'Devuelve las disputas creadas por el usuario autenticado.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de disputas' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "myDisputes", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Responder disputa',
        description: 'Agrega un mensaje/respuesta a una disputa existente (solo actores válidos o admin).',
    }),
    (0, swagger_1.ApiBody)({ type: reply_dispute_dto_1.ReplyDisputeDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Respuesta registrada' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'No tienes permiso para responder esta disputa' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'La disputa no acepta más respuestas' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Disputa no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reply_dispute_dto_1.ReplyDisputeDto, Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "reply", null);
exports.DisputesController = DisputesController = __decorate([
    (0, swagger_1.ApiTags)('Disputas (HU-01 HU-02)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('disputes'),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map