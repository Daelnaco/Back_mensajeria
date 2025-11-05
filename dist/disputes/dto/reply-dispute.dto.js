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
exports.ReplyDisputeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ReplyDisputeDto {
}
exports.ReplyDisputeDto = ReplyDisputeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['message', 'evidence', 'agreement', 'status_change'] }),
    (0, class_validator_1.IsEnum)(['message', 'evidence', 'agreement', 'status_change']),
    __metadata("design:type", String)
], ReplyDisputeDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Adjunto comprobante' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReplyDisputeDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'JSON con metadatos del evento',
        example: { url: 'https://bucket/archivo.png' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReplyDisputeDto.prototype, "payload", void 0);
//# sourceMappingURL=reply-dispute.dto.js.map