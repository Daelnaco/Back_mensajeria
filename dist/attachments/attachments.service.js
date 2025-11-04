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
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attachment_schema_1 = require("./schemas/attachment.schema");
let AttachmentsService = class AttachmentsService {
    constructor(attachmentModel) {
        this.attachmentModel = attachmentModel;
    }
    validateMime(mime) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(mime)) {
            throw new common_1.BadRequestException('Formato no permitido. Solo imágenes (jpeg, png, webp)');
        }
    }
    validateSize(size) {
        const MAX = 5 * 1024 * 1024;
        if (size > MAX) {
            throw new common_1.BadRequestException('Archivo demasiado grande (máx 5MB).');
        }
    }
    async fakeScan() {
        return true;
    }
    async handleUpload(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No se envió ningún archivo');
        }
        if (!user || !user.id) {
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        this.validateMime(file.mimetype);
        this.validateSize(file.size);
        await this.fakeScan();
        const created = await this.attachmentModel.create({
            ownerUserId: user.id,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
        });
        return {
            id: created._id.toString(),
            url: created.url,
            mimeType: created.mimeType,
            size: created.size,
            ownerUserId: created.ownerUserId,
            createdAt: created.createdAt,
        };
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attachment_schema_1.Attachment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map