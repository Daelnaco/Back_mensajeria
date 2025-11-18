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
exports.DisputeOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const dispute_reason_enum_1 = require("../../entities/dispute-reason.enum");
const dispute_status_enum_1 = require("../../entities/dispute-status.enum");
let DisputeOrmEntity = class DisputeOrmEntity {
};
exports.DisputeOrmEntity = DisputeOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], DisputeOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversation_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], DisputeOrmEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], DisputeOrmEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opener_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], DisputeOrmEntity.prototype, "openerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: dispute_reason_enum_1.DisputeReason,
    }),
    __metadata("design:type", String)
], DisputeOrmEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], DisputeOrmEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: dispute_status_enum_1.DisputeStatus,
        default: dispute_status_enum_1.DisputeStatus.OPEN,
    }),
    __metadata("design:type", String)
], DisputeOrmEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'opened_at', type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], DisputeOrmEntity.prototype, "openedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_at', type: 'datetime', precision: 3, nullable: true }),
    __metadata("design:type", Object)
], DisputeOrmEntity.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime', precision: 3 }),
    __metadata("design:type", Date)
], DisputeOrmEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted_at', type: 'datetime', precision: 3, nullable: true }),
    __metadata("design:type", Object)
], DisputeOrmEntity.prototype, "deletedAt", void 0);
exports.DisputeOrmEntity = DisputeOrmEntity = __decorate([
    (0, typeorm_1.Entity)('dispute')
], DisputeOrmEntity);
//# sourceMappingURL=dispute.orm-entity.js.map