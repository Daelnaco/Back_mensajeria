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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dispute_schema_1 = require("./schemas/dispute.schema");
const dispute_event_schema_1 = require("./schemas/dispute-event.schema");
async function fetchOwnerInfoFromOrderService(orderId) {
    return {
        buyerId: 'USER123',
        sellerId: 'USER456',
    };
}
let DisputesService = class DisputesService {
    constructor(disputeModel, disputeEventModel) {
        this.disputeModel = disputeModel;
        this.disputeEventModel = disputeEventModel;
    }
    async openDispute(dto, user, ip, userAgent) {
        if (dto.orderId) {
            const orderInfo = await fetchOwnerInfoFromOrderService(dto.orderId);
            const isBuyer = orderInfo.buyerId === user.id;
            const isSeller = orderInfo.sellerId === user.id;
            if (!isBuyer && !isSeller) {
                throw new common_1.ForbiddenException('No puedes abrir disputa sobre una orden que no es tuya');
            }
        }
        const existing = await this.disputeModel.findOne({
            ...(dto.orderId ? { orderId: dto.orderId } : {}),
            status: 'ABIERTO',
        });
        if (existing) {
            throw new common_1.ConflictException('Ya existe una disputa abierta para esta orden');
        }
        const now = new Date();
        const dispute = await this.disputeModel.create({
            orderId: dto.orderId ?? null,
            reason: dto.reason,
            description: dto.description,
            attachments: dto.attachments ?? [],
            status: 'ABIERTO',
            createdByUserId: user.id,
            createdByIp: ip,
            createdByUserAgent: userAgent,
            lastActivityAt: now,
        });
        await this.disputeEventModel.create({
            disputeId: dispute._id.toString(),
            eventType: 'CREATED',
            actorUserId: user.id,
            message: dto.description,
            attachments: dto.attachments ?? [],
        });
        return dispute;
    }
    async findAllByUser(userId) {
        return this.disputeModel
            .find({ createdByUserId: userId })
            .sort({ createdAt: -1 });
    }
    async replyToDispute(disputeId, dto, user) {
        const dispute = await this.disputeModel.findById(disputeId);
        if (!dispute) {
            throw new common_1.NotFoundException('Disputa no encontrada');
        }
        const orderInfo = dispute.orderId
            ? await fetchOwnerInfoFromOrderService(dispute.orderId)
            : null;
        const isBuyer = orderInfo ? orderInfo.buyerId === user.id : false;
        const isSeller = orderInfo ? orderInfo.sellerId === user.id : false;
        const isAdmin = user.role === 'admin';
        if (!isBuyer && !isSeller && !isAdmin) {
            throw new common_1.ForbiddenException('No puedes responder esta disputa');
        }
        if (dispute.status !== 'ABIERTO' && dispute.status !== 'EN_REVISION') {
            throw new common_1.BadRequestException('La disputa no acepta más respuestas');
        }
        await this.disputeEventModel.create({
            disputeId: dispute._id.toString(),
            eventType: 'REPLIED',
            actorUserId: user.id,
            message: dto.message ?? '',
            attachments: dto.attachments ?? [],
        });
        dispute.lastActivityAt = new Date();
        await dispute.save();
        return { ok: true };
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dispute_schema_1.Dispute.name)),
    __param(1, (0, mongoose_1.InjectModel)(dispute_event_schema_1.DisputeEvent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map