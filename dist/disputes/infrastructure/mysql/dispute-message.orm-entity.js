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
exports.DisputeMessageOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const dispute_orm_entity_1 = require("./dispute.orm-entity");
let DisputeMessageOrmEntity = class DisputeMessageOrmEntity {
};
exports.DisputeMessageOrmEntity = DisputeMessageOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DisputeMessageOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], DisputeMessageOrmEntity.prototype, "disputeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 36 }),
    __metadata("design:type", String)
], DisputeMessageOrmEntity.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DisputeMessageOrmEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], DisputeMessageOrmEntity.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DisputeMessageOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dispute_orm_entity_1.DisputeOrmEntity, (dispute) => dispute.messages, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", dispute_orm_entity_1.DisputeOrmEntity)
], DisputeMessageOrmEntity.prototype, "dispute", void 0);
exports.DisputeMessageOrmEntity = DisputeMessageOrmEntity = __decorate([
    (0, typeorm_1.Entity)('dispute_messages')
], DisputeMessageOrmEntity);
//# sourceMappingURL=dispute-message.orm-entity.js.map