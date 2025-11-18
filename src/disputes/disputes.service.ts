import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeFiltersDto } from './dto/dispute-filters.dto';
import { Dispute } from './entities/dispute.entity';
import { DisputeStatus } from './entities/dispute-status.enum';
import { DISPUTE_REPOSITORY, DisputeRepository } from './repositories/dispute.repository';

@Injectable()
export class DisputesService {
  constructor(
    @Inject(DISPUTE_REPOSITORY)
    private readonly disputeRepository: DisputeRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createDispute(
    openerId: string,
    payload: CreateDisputeDto,
  ): Promise<Dispute> {
    const conversationId = payload.conversationId
      ? String(payload.conversationId)
      : null;
    const dispute = await this.disputeRepository.create({
      openerId,
      orderId: payload.orderId,
      conversationId,
      reason: payload.reason,
      description: payload.description,
      status: DisputeStatus.OPEN,
    });

    this.eventEmitter.emit('dispute.created', {
      disputeId: dispute.id,
      openerId,
    });

    return dispute;
  }

  async getBuyerDisputes(
    openerId: string,
    filters: DisputeFiltersDto,
  ): Promise<PaginationResult<Dispute>> {
    return this.disputeRepository.findByOpener(openerId, filters);
  }

  async getSellerDisputes(
    sellerId: string,
    filters: DisputeFiltersDto,
  ): Promise<PaginationResult<Dispute>> {
    return this.disputeRepository.findByParticipant(sellerId, filters);
  }

  async findById(id: string): Promise<Dispute> {
    const dispute = await this.disputeRepository.findById(id);
    if (!dispute) {
      throw new NotFoundException('La disputa no existe');
    }
    return dispute;
  }
}
