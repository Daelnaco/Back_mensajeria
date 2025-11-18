import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../../common/interfaces/pagination-result.interface';
import { Dispute } from '../../entities/dispute.entity';
import { DisputeStatus } from '../../entities/dispute-status.enum';
import { DisputeRepository } from '../../repositories/dispute.repository';
import { DisputeOrmEntity } from './dispute.orm-entity';
export declare class DisputeMysqlRepository implements DisputeRepository {
    private readonly repository;
    constructor(repository: Repository<DisputeOrmEntity>);
    create(payload: Omit<Dispute, 'id' | 'openedAt' | 'updatedAt'>): Promise<Dispute>;
    save(dispute: Dispute): Promise<Dispute>;
    findById(id: string): Promise<Dispute | null>;
    findByOpener(openerId: string, filters: PaginationQueryDto & {
        status?: DisputeStatus;
    }): Promise<PaginationResult<Dispute>>;
    findByParticipant(participantId: string, filters: PaginationQueryDto & {
        status?: DisputeStatus;
    }): Promise<PaginationResult<Dispute>>;
    updateStatus(id: string, status: DisputeStatus): Promise<void>;
    private toDomain;
}
