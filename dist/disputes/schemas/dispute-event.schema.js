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
exports.DisputeEventSchema = exports.DisputeEvent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DisputeEvent = class DisputeEvent {
};
exports.DisputeEvent = DisputeEvent;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Dispute', required: true }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "disputeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['CREATED', 'REPLIED'] }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DisputeEvent.prototype, "actorUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DisputeEvent.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DisputeEvent.prototype, "attachments", void 0);
exports.DisputeEvent = DisputeEvent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DisputeEvent);
exports.DisputeEventSchema = mongoose_1.SchemaFactory.createForClass(DisputeEvent);
//# sourceMappingURL=dispute-event.schema.js.map