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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dispute_entity_1 = require("./entities/dispute.entity");
const dispute_event_entity_1 = require("./entities/dispute-event.entity");
let DisputesService = class DisputesService {
    constructor(disputes, events) {
        this.disputes = disputes;
        this.events = events;
    }
    async validateOwnershipOrThrow(userId, dto) {
        const esDueñoPedido = !!dto.orderId;
        const esDueñoPublicacion = !!dto.postId;
        if (!esDueñoPedido && !esDueñoPublicacion) {
            throw new common_1.ForbiddenException('El recurso no pertenece al usuario');
        }
        return { idComprador: userId, idVendedor: 999 };
    }
    async ensureNotDuplicateOpen(dto, _idComprador) {
        const dup = await this.disputes.findOne({
            where: [
                dto.orderId
                    ? { idPedido: dto.orderId, estado: 'ABIERTO' }
                    : { idPedido: (0, typeorm_2.Not)(0) },
                dto.postId
                    ? { idPublicacion: dto.postId, estado: 'ABIERTO' }
                    : { idPublicacion: (0, typeorm_2.Not)(0) },
            ],
        });
        if (dup) {
            throw new common_1.BadRequestException('Ya existe una disputa abierta para este recurso');
        }
    }
    async create(dto, user, ip, ua) {
        const { idComprador, idVendedor } = await this.validateOwnershipOrThrow(Number(user.id), dto);
        await this.ensureNotDuplicateOpen(dto, idComprador);
        const entity = this.disputes.create({
            idPedido: dto.orderId,
            idPublicacion: dto.postId,
            idComprador,
            idVendedor,
            motivo: dto.motivo,
            descripcion: dto.descripcion,
            estado: 'ABIERTO',
            ipOrigen: ip,
            userAgent: ua,
        });
        const saved = await this.disputes.save(entity);
        const evt = this.events.create({
            disputa: saved,
            actorId: Number(user.id),
            actorRol: user.role,
            tipo: 'CREATED',
            payload: dto.adjuntos
                ? JSON.stringify({ adjuntos: dto.adjuntos })
                : undefined,
        });
        await this.events.save(evt);
        return saved;
    }
    async assertCanReplyOrThrow(d, user) {
        if (!d)
            throw new common_1.NotFoundException('Disputa no encontrada');
        if (!['ABIERTO', 'EN_REVISION'].includes(d.estado)) {
            throw new common_1.BadRequestException('La disputa no admite respuestas en este estado');
        }
        const uid = Number(user.id);
        const isMember = [d.idComprador, d.idVendedor].includes(uid);
        const isAdmin = user?.role === 'admin';
        if (!isMember && !isAdmin) {
            throw new common_1.ForbiddenException('No perteneces a esta disputa');
        }
    }
    async reply(disputeId, dto, user) {
        const d = await this.disputes.findOne({
            where: { idDisputa: disputeId },
        });
        await this.assertCanReplyOrThrow(d, user);
        const evt = this.events.create({
            disputa: d,
            actorId: Number(user.id),
            actorRol: user.role,
            tipo: 'REPLIED',
            payload: JSON.stringify({
                mensaje: dto.mensaje,
                adjuntos: dto.adjuntos ?? [],
            }),
        });
        await this.events.save(evt);
        await this.disputes.update({ idDisputa: disputeId }, { actualizadoEn: new Date() });
        return { ok: true };
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dispute_entity_1.Dispute)),
    __param(1, (0, typeorm_1.InjectRepository)(dispute_event_entity_1.DisputeEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map