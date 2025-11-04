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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispute = void 0;
const typeorm_1 = require("typeorm");
const dispute_event_entity_1 = require("./dispute-event.entity");
let Dispute = class Dispute {
};
exports.Dispute = Dispute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_disputa' }),
    __metadata("design:type", Number)
], Dispute.prototype, "idDisputa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_pedido', nullable: true }),
    __metadata("design:type", Number)
], Dispute.prototype, "idPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_publicacion', nullable: true }),
    __metadata("design:type", Number)
], Dispute.prototype, "idPublicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_comprador' }),
    __metadata("design:type", Number)
], Dispute.prototype, "idComprador", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_vendedor' }),
    __metadata("design:type", Number)
], Dispute.prototype, "idVendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'motivo' }),
    __metadata("design:type", String)
], Dispute.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'descripcion', nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'estado', default: 'ABIERTO' }),
    __metadata("design:type", String)
], Dispute.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, name: 'ip_origen', nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "ipOrigen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'user_agent', nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], Dispute.prototype, "creadoEn", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'actualizado_en' }),
    __metadata("design:type", Date)
], Dispute.prototype, "actualizadoEn", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dispute_event_entity_1.DisputeEvent, (e) => e.disputa, { cascade: true }),
    __metadata("design:type", Array)
], Dispute.prototype, "eventos", void 0);
exports.Dispute = Dispute = __decorate([
    (0, typeorm_1.Entity)('disputes')
], Dispute);
//# sourceMappingURL=dispute.entity.js.map