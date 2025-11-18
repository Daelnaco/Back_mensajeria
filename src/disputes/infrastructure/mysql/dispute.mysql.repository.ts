import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../../common/interfaces/pagination-result.interface';
import { Dispute } from '../../entities/dispute.entity';
import { DisputeStatus } from '../../entities/dispute-status.enum';
import { DisputeRepository } from '../../repositories/dispute.repository';
import { DisputeOrmEntity } from './dispute.orm-entity';

@Injectable()
export class DisputeMysqlRepository implements DisputeRepository {
  constructor(
    @InjectRepository(DisputeOrmEntity)
    private readonly repository: Repository<DisputeOrmEntity>,
  ) {}

  async create(payload: Omit<Dispute, 'id' | 'openedAt' | 'updatedAt'>): Promise<Dispute> {
    const entity = this.repository.create({
      ...payload,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async save(dispute: Dispute): Promise<Dispute> {
    const saved = await this.repository.save(dispute);
    return this.toDomain(saved as DisputeOrmEntity);
  }

  async findById(id: string): Promise<Dispute | null> {
    const dispute = await this.repository.findOne({
      where: { id },
    });
    return dispute ? this.toDomain(dispute) : null;
  }

  async findByOpener(
    openerId: string,
    filters: PaginationQueryDto & { status?: DisputeStatus },
  ): Promise<PaginationResult<Dispute>> {
    const qb = this.repository.createQueryBuilder('dispute');
    qb.where('dispute.openerId = :openerId', { openerId });

    if (filters.status) {
      qb.andWhere('dispute.status = :status', { status: filters.status });
    }

    qb.skip(filters.skip ?? 0).take(filters.limit ?? 20).orderBy('dispute.openedAt', 'DESC');

    const [rows, count] = await qb.getManyAndCount();
    return {
      data: rows.map((row) => this.toDomain(row)),
      total: count,
      skip: filters.skip ?? 0,
      limit: filters.limit ?? 20,
    };
  }

  async findByParticipant(
    participantId: string,
    filters: PaginationQueryDto & { status?: DisputeStatus },
  ): Promise<PaginationResult<Dispute>> {
    const qb = this.repository.createQueryBuilder('dispute');
    qb.where('dispute.conversationId IS NOT NULL');
    qb.andWhere(
      '(SELECT COUNT(*) FROM conversation_participant cp WHERE cp.conversation_id = dispute.conversationId AND cp.user_id = :participantId) > 0',
      { participantId },
    );

    if (filters.status) {
      qb.andWhere('dispute.status = :status', { status: filters.status });
    }

    qb.skip(filters.skip ?? 0).take(filters.limit ?? 20).orderBy('dispute.openedAt', 'DESC');

    const [rows, count] = await qb.getManyAndCount();
    return {
      data: rows.map((row) => this.toDomain(row)),
      total: count,
      skip: filters.skip ?? 0,
      limit: filters.limit ?? 20,
    };
  }

  async updateStatus(id: string, status: DisputeStatus): Promise<void> {
    await this.repository.update({ id }, { status });
  }

  private toDomain(entity: DisputeOrmEntity): Dispute {
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
}
