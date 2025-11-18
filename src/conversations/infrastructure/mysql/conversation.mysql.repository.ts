import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../../common/interfaces/pagination-result.interface';
import {
  Conversation,
  ConversationMessage,
} from '../../entities/conversation.entity';
import {
  ConversationMessageRepository,
  ConversationRepository,
} from '../../repositories/conversation.repository';
import { ConversationMessageOrmEntity } from './conversation-message.orm-entity';
import { ConversationOrmEntity } from './conversation.orm-entity';

@Injectable()
export class ConversationMysqlRepository implements ConversationRepository {
  constructor(
    @InjectRepository(ConversationOrmEntity)
    private readonly repository: Repository<ConversationOrmEntity>,
  ) {}

  async findExistingConversation(
    buyerId: string,
    sellerId: string,
    orderId?: number | null,
  ): Promise<Conversation | null> {
    const where: Partial<Record<keyof ConversationOrmEntity, any>> = {
      buyerId,
      sellerId,
      orderId: orderId ?? IsNull(),
    };

    const conversation = await this.repository.findOne({ where });
    return conversation ? this.toDomain(conversation) : null;
  }

  async create(
    conversation: Omit<
      Conversation,
      'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'deletedAt'
    >,
  ): Promise<Conversation> {
    const entity = this.repository.create({
      buyerId: conversation.buyerId,
      sellerId: conversation.sellerId,
      orderId: conversation.orderId ?? null,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Conversation | null> {
    const conversation = await this.repository.findOne({ where: { id } });
    return conversation ? this.toDomain(conversation) : null;
  }

  async listUserConversations(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Conversation>> {
    const qb = this.repository.createQueryBuilder('conversation');
    qb.where(
      'conversation.buyerId = :userId OR conversation.sellerId = :userId',
      { userId },
    );
    qb.orderBy('conversation.lastActivityAt', 'DESC');
    qb.skip(pagination.skip ?? 0).take(pagination.limit ?? 20);

    const [rows, total] = await qb.getManyAndCount();
    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      skip: pagination.skip ?? 0,
      limit: pagination.limit ?? 20,
    };
  }

  private toDomain(entity: ConversationOrmEntity): Conversation {
    return {
      id: entity.id,
      buyerId: entity.buyerId,
      sellerId: entity.sellerId,
      orderId: entity.orderId,
      lastActivityAt: entity.lastActivityAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}

@Injectable()
export class ConversationMessageMysqlRepository
  implements ConversationMessageRepository
{
  constructor(
    @InjectRepository(ConversationMessageOrmEntity)
    private readonly repository: Repository<ConversationMessageOrmEntity>,
  ) {}

  async create(
    message: Omit<
      ConversationMessage,
      'id' | 'createdAt' | 'editedAt' | 'deletedAt'
    >,
  ): Promise<ConversationMessage> {
    const entity = this.repository.create({
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      type: message.type,
      body: message.text ?? null,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByConversation(
    conversationId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<ConversationMessage>> {
    const [rows, total] = await this.repository.findAndCount({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      skip: pagination.skip ?? 0,
      take: pagination.limit ?? 20,
    });

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      skip: pagination.skip ?? 0,
      limit: pagination.limit ?? 20,
    };
  }

  private toDomain(entity: ConversationMessageOrmEntity): ConversationMessage {
    return {
      id: entity.id,
      conversationId: entity.conversationId,
      senderId: entity.senderId,
      senderRole: entity.senderRole,
      type: entity.type,
      text: entity.body ?? '',
      attachments: [],
      createdAt: entity.createdAt,
      editedAt: entity.editedAt,
      deletedAt: entity.deletedAt,
    };
  }
}
