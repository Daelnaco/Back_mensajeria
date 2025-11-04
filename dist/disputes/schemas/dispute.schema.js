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
exports.DisputeSchema = exports.Dispute = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Dispute = class Dispute {
};
exports.Dispute = Dispute;
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Dispute.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Dispute.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Dispute.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Dispute.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ABIERTO', 'EN_REVISION', 'CERRADO'], default: 'ABIERTO' }),
    __metadata("design:type", String)
], Dispute.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Dispute.prototype, "createdByUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Dispute.prototype, "createdByIp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Dispute.prototype, "createdByUserAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Dispute.prototype, "lastActivityAt", void 0);
exports.Dispute = Dispute = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Dispute);
exports.DisputeSchema = mongoose_1.SchemaFactory.createForClass(Dispute);
//# sourceMappingURL=dispute.schema.js.map