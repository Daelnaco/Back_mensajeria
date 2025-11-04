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
exports.ConversationCreateMessageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ConversationCreateMessageDto {
}
exports.ConversationCreateMessageDto = ConversationCreateMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la orden asociada a la conversación',
        example: 'ORD-12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConversationCreateMessageDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de mensaje',
        example: 'text',
        enum: ['text', 'image'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['text', 'image']),
    __metadata("design:type", String)
], ConversationCreateMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contenido del mensaje si es de tipo texto, o caption si es imagen',
        example: 'Hola, ¿puedes confirmar el estado del envío?',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConversationCreateMessageDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Adjuntos (URLs de imágenes u otros archivos)',
        example: ['https://uploads.example.com/evidencia1.jpg'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ConversationCreateMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del otro participante en la conversación (por ejemplo vendedor si yo soy comprador)',
        example: 'USER456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConversationCreateMessageDto.prototype, "otherUserId", void 0);
//# sourceMappingURL=create-message.dto.js.map