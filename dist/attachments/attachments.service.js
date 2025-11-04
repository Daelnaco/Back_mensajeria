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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = require("node:fs");
const path = require("node:path");
const attachment_entity_1 = require("./entities/attachment.entity");
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;
let AttachmentsService = class AttachmentsService {
    constructor(repo) {
        this.repo = repo;
    }
    async antivirusScan(_absPath) {
        return true;
    }
    async store(file) {
        if (!ALLOWED.includes(file.mimetype))
            throw new common_1.BadRequestException('Formato no permitido');
        if (file.size > MAX_SIZE)
            throw new common_1.BadRequestException('Archivo excede tamaño máximo');
        const abs = path.resolve(file.path);
        const ok = await this.antivirusScan(abs);
        if (!ok) {
            fs.unlinkSync(abs);
            throw new common_1.BadRequestException('Fallo de escaneo/antimalware');
        }
        const saved = await this.repo.save(this.repo.create({
            storagePath: abs,
            mimeType: file.mimetype,
            size: file.size,
        }));
        return saved;
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attachment_entity_1.Attachment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map