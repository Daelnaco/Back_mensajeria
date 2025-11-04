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
exports.DisputeEvent = void 0;
const typeorm_1 = require("typeorm");
const dispute_entity_1 = require("./dispute.entity");
let DisputeEvent = class DisputeEvent {
};
exports.DisputeEvent = DisputeEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DisputeEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dispute_entity_1.Dispute, (d) => d.eventos, { onDelete: 'CASCADE' }),
    __metadata("design:type", dispute_entity_1.Dispute)
], DisputeEvent.prototype, "disputa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'actor_id' }),
    __metadata("design:type", Number)
], DisputeEvent.prototype, "actorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, name: 'actor_rol', nullable: true }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "actorRol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creado_en' }),
    __metadata("design:type", Date)
], DisputeEvent.prototype, "creadoEn", void 0);
exports.DisputeEvent = DisputeEvent = __decorate([
    (0, typeorm_1.Entity)('dispute_events')
], DisputeEvent);
//# sourceMappingURL=dispute-event.entity.js.map