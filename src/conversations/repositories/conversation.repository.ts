import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { PaginationResult } from '../../common/interfaces/pagination-result.interface';
import {
  Conversation,
  ConversationMessage,
} from '../entities/conversation.entity';

export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');

export interface ConversationRepository {
  findExistingConversation(
    buyerId: string,
    sellerId: string,
    orderId?: number | null,
  ): Promise<Conversation | null>;
  create(
    conversation: Omit<
      Conversation,
      'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'deletedAt'
    >,
  ): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  listUserConversations(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Conversation>>;
}

export const CONVERSATION_MESSAGE_REPOSITORY = Symbol('CONVERSATION_MESSAGE_REPOSITORY');

export interface ConversationMessageRepository {
  create(
    message: Omit<
      ConversationMessage,
      'id' | 'createdAt' | 'editedAt' | 'deletedAt'
    >,
  ): Promise<ConversationMessage>;
  findByConversation(
    conversationId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<ConversationMessage>>;
}
