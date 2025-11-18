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
const event_emitter_1 = require("@nestjs/event-emitter");
const dispute_status_enum_1 = require("./entities/dispute-status.enum");
const dispute_repository_1 = require("./repositories/dispute.repository");
let DisputesService = class DisputesService {
    constructor(disputeRepository, eventEmitter) {
        this.disputeRepository = disputeRepository;
        this.eventEmitter = eventEmitter;
    }
    async createDispute(openerId, payload) {
        const conversationId = payload.conversationId
            ? String(payload.conversationId)
            : null;
        const dispute = await this.disputeRepository.create({
            openerId,
            orderId: payload.orderId,
            conversationId,
            reason: payload.reason,
            description: payload.description,
            status: dispute_status_enum_1.DisputeStatus.OPEN,
        });
        this.eventEmitter.emit('dispute.created', {
            disputeId: dispute.id,
            openerId,
        });
        return dispute;
    }
    async getBuyerDisputes(openerId, filters) {
        return this.disputeRepository.findByOpener(openerId, filters);
    }
    async getSellerDisputes(sellerId, filters) {
        return this.disputeRepository.findByParticipant(sellerId, filters);
    }
    async findById(id) {
        const dispute = await this.disputeRepository.findById(id);
        if (!dispute) {
            throw new common_1.NotFoundException('La disputa no existe');
        }
        return dispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(dispute_repository_1.DISPUTE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map