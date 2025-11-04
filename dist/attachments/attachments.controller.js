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
exports.AttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const attachments_service_1 = require("./attachments.service");
const swagger_1 = require("@nestjs/swagger");
let AttachmentsController = class AttachmentsController {
    constructor(attachmentsService) {
        this.attachmentsService = attachmentsService;
    }
    async uploadFile(file, req) {
        return this.attachmentsService.handleUpload(file, req.user);
    }
};
exports.AttachmentsController = AttachmentsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const ext = file.originalname.split('.').pop() || 'bin';
                const unique = (0, crypto_1.randomUUID)();
                cb(null, `${unique}.${ext}`);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Subir adjunto (imagen) para el chat',
        description: 'Sube una imagen, valida MIME/tamaño, realiza un "escaneo" simulado, y guarda metadatos en BD.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagen a adjuntar (jpeg/png/webp)',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Archivo subido y registrado',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Archivo inválido (tipo no permitido, tamaño excedido, sin archivo, etc.)',
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'El usuario no está autorizado a subir archivos',
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "uploadFile", null);
exports.AttachmentsController = AttachmentsController = __decorate([
    (0, swagger_1.ApiTags)('Adjuntos (HU-04)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('attachments'),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService])
], AttachmentsController);
//# sourceMappingURL=attachments.controller.js.map