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
const swagger_1 = require("@nestjs/swagger");
const disputes_service_1 = require("./disputes.service");
const create_dispute_dto_1 = require("./dto/create-dispute.dto");
const reply_dispute_dto_1 = require("./dto/reply-dispute.dto");
let DisputesController = class DisputesController {
    constructor(svc) {
        this.svc = svc;
    }
    open(req, dto) {
        const openerId = req?.user?.id ?? 101;
        return this.svc.open(dto.conversation_id ?? null, openerId, dto.reason, dto.order_id ?? null, dto.description ?? null);
    }
    reply(id, req, dto) {
        const uid = req?.user?.id ?? 101;
        return this.svc.reply(+id, uid, dto.eventType, dto.note, dto.payload);
    }
    close(id) {
        return this.svc.close(+id);
    }
    events(id) {
        return this.svc.events(+id);
    }
    get(id) {
        return this.svc.findById(+id);
    }
    async list(req, status, scope = 'all') {
        const uid = req.user?.id;
        return this.svc.list({ status, scope, uid });
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Abrir disputa' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Disputa creada' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_dispute_dto_1.CreateDisputeDto]),
    __metadata("design:returntype", void 0)
], DisputesController.prototype, "open", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    (0, swagger_1.ApiOperation)({ summary: 'Responder disputa (mensaje/evidencia/acuerdo)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reply_dispute_dto_1.ReplyDisputeDto]),
    __metadata("design:returntype", void 0)
], DisputesController.prototype, "reply", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar disputa (requiere 2 acuerdos distintos)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisputesController.prototype, "close", null);
__decorate([
    (0, common_1.Get)(':id/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Timeline de eventos de la disputa' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisputesController.prototype, "events", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de disputa' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DisputesController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['open', 'in_review', 'agreement_pending', 'closed', 'rejected'] }),
    (0, swagger_1.ApiQuery)({ name: 'scope', required: false, enum: ['mine', 'all'] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('scope')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "list", null);
exports.DisputesController = DisputesController = __decorate([
    (0, swagger_1.ApiTags)('Disputes'),
    (0, common_1.Controller)('disputes'),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map