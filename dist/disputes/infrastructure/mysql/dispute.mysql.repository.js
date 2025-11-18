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
exports.DisputeMysqlRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dispute_orm_entity_1 = require("./dispute.orm-entity");
let DisputeMysqlRepository = class DisputeMysqlRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(payload) {
        const entity = this.repository.create({
            ...payload,
        });
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async save(dispute) {
        const saved = await this.repository.save(dispute);
        return this.toDomain(saved);
    }
    async findById(id) {
        const dispute = await this.repository.findOne({
            where: { id },
        });
        return dispute ? this.toDomain(dispute) : null;
    }
    async findByOpener(openerId, filters) {
        var _a, _b, _c, _d;
        const qb = this.repository.createQueryBuilder('dispute');
        qb.where('dispute.openerId = :openerId', { openerId });
        if (filters.status) {
            qb.andWhere('dispute.status = :status', { status: filters.status });
        }
        qb.skip((_a = filters.skip) !== null && _a !== void 0 ? _a : 0).take((_b = filters.limit) !== null && _b !== void 0 ? _b : 20).orderBy('dispute.openedAt', 'DESC');
        const [rows, count] = await qb.getManyAndCount();
        return {
            data: rows.map((row) => this.toDomain(row)),
            total: count,
            skip: (_c = filters.skip) !== null && _c !== void 0 ? _c : 0,
            limit: (_d = filters.limit) !== null && _d !== void 0 ? _d : 20,
        };
    }
    async findByParticipant(participantId, filters) {
        var _a, _b, _c, _d;
        const qb = this.repository.createQueryBuilder('dispute');
        qb.where('dispute.conversationId IS NOT NULL');
        qb.andWhere('(SELECT COUNT(*) FROM conversation_participant cp WHERE cp.conversation_id = dispute.conversationId AND cp.user_id = :participantId) > 0', { participantId });
        if (filters.status) {
            qb.andWhere('dispute.status = :status', { status: filters.status });
        }
        qb.skip((_a = filters.skip) !== null && _a !== void 0 ? _a : 0).take((_b = filters.limit) !== null && _b !== void 0 ? _b : 20).orderBy('dispute.openedAt', 'DESC');
        const [rows, count] = await qb.getManyAndCount();
        return {
            data: rows.map((row) => this.toDomain(row)),
            total: count,
            skip: (_c = filters.skip) !== null && _c !== void 0 ? _c : 0,
            limit: (_d = filters.limit) !== null && _d !== void 0 ? _d : 20,
        };
    }
    async updateStatus(id, status) {
        await this.repository.update({ id }, { status });
    }
    toDomain(entity) {
        return {
            id: entity.id,
            conversationId: entity.conversationId,
            orderId: entity.orderId,
            openerId: entity.openerId,
            reason: entity.reason,
            description: entity.description,
            status: entity.status,
            openedAt: entity.openedAt,
            closedAt: entity.closedAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
        };
    }
};
exports.DisputeMysqlRepository = DisputeMysqlRepository;
exports.DisputeMysqlRepository = DisputeMysqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dispute_orm_entity_1.DisputeOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DisputeMysqlRepository);
//# sourceMappingURL=dispute.mysql.repository.js.map