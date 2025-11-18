import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../../common/interfaces/pagination-result.interface';
import { Conversation, ConversationMessage } from '../../entities/conversation.entity';
import { ConversationMessageRepository, ConversationRepository } from '../../repositories/conversation.repository';
import { ConversationMessageOrmEntity } from './conversation-message.orm-entity';
import { ConversationOrmEntity } from './conversation.orm-entity';
export declare class ConversationMysqlRepository implements ConversationRepository {
    private readonly repository;
    constructor(repository: Repository<ConversationOrmEntity>);
    findExistingConversation(buyerId: string, sellerId: string, orderId?: number | null): Promise<Conversation | null>;
    create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'deletedAt'>): Promise<Conversation>;
    findById(id: string): Promise<Conversation | null>;
    listUserConversations(userId: string, pagination: PaginationQueryDto): Promise<PaginationResult<Conversation>>;
    private toDomain;
}
export declare class ConversationMessageMysqlRepository implements ConversationMessageRepository {
    private readonly repository;
    constructor(repository: Repository<ConversationMessageOrmEntity>);
    create(message: Omit<ConversationMessage, 'id' | 'createdAt' | 'editedAt' | 'deletedAt'>): Promise<ConversationMessage>;
    findByConversation(conversationId: string, pagination: PaginationQueryDto): Promise<PaginationResult<ConversationMessage>>;
    private toDomain;
}
