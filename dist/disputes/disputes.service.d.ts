import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeFiltersDto } from './dto/dispute-filters.dto';
import { Dispute } from './entities/dispute.entity';
import { DisputeRepository } from './repositories/dispute.repository';
export declare class DisputesService {
    private readonly disputeRepository;
    private readonly eventEmitter;
    constructor(disputeRepository: DisputeRepository, eventEmitter: EventEmitter2);
    createDispute(openerId: string, payload: CreateDisputeDto): Promise<Dispute>;
    getBuyerDisputes(openerId: string, filters: DisputeFiltersDto): Promise<PaginationResult<Dispute>>;
    getSellerDisputes(sellerId: string, filters: DisputeFiltersDto): Promise<PaginationResult<Dispute>>;
    findById(id: string): Promise<Dispute>;
}
