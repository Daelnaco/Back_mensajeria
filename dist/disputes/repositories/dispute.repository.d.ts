import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../common/interfaces/pagination-result.interface';
import { Dispute } from '../entities/dispute.entity';
import { DisputeStatus } from '../entities/dispute-status.enum';
export declare const DISPUTE_REPOSITORY: unique symbol;
export interface DisputeRepository {
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
}
