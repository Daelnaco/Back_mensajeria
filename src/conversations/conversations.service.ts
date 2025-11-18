import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { SendConversationMessageDto } from './dto/send-message.dto';
import {
  CONVERSATION_MESSAGE_REPOSITORY,
  ConversationMessageRepository,
  CONVERSATION_REPOSITORY,
  ConversationRepository,
} from './repositories/conversation.repository';
import { Conversation, ConversationMessage } from './entities/conversation.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(CONVERSATION_MESSAGE_REPOSITORY)
    private readonly messageRepository: ConversationMessageRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getOrCreateConversation(
    currentUserId: string,
    role: Role,
    payload: CreateConversationDto,
  ): Promise<Conversation> {
    if (currentUserId === payload.otherUserId) {
      throw new ForbiddenException('No puedes crear una conversacion contigo mismo');
    }

    const { buyerId, sellerId } = this.resolveParticipants(
      currentUserId,
      role,
      payload.otherUserId,
    );
    const orderId = payload.orderId ?? null;

    const existing = await this.conversationRepository.findExistingConversation(
      buyerId,
      sellerId,
      orderId,
    );

    if (existing) {
      return existing;
    }

    const conversation = await this.conversationRepository.create({
      buyerId,
      sellerId,
      orderId,
    });

    this.eventEmitter.emit('conversation.created', conversation);
    return conversation;
  }

  async listUserConversations(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Conversation>> {
    return this.conversationRepository.listUserConversations(userId, pagination);
  }

  async listMessages(
    conversationId: string,
    userId: string,
    pagination: ListMessagesQueryDto,
  ): Promise<PaginationResult<ConversationMessage>> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('La conversacion no existe');
    }

    this.ensureParticipant(conversation, userId);
    return this.messageRepository.findByConversation(conversationId, pagination);
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    payload: SendConversationMessageDto,
  ): Promise<ConversationMessage> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('La conversacion no existe');
    }

    this.ensureParticipant(conversation, userId);

    const senderRole = conversation.buyerId === userId ? Role.BUYER : Role.SELLER;

    const message = await this.messageRepository.create({
      conversationId,
      senderId: userId,
      senderRole,
      type: 'text',
      text: payload.text,
      attachments: payload.attachments ?? [],
    });

    this.eventEmitter.emit('conversation.message.created', {
      conversationId,
      senderId: userId,
      buyerId: conversation.buyerId,
      sellerId: conversation.sellerId,
    });

    return message;
  }

  private ensureParticipant(conversation: Conversation, userId: string) {
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new ForbiddenException('No perteneces a esta conversacion');
    }
  }

  private resolveParticipants(currentUserId: string, role: Role, otherUserId: string) {
    if (role === Role.BUYER) {
      return { buyerId: currentUserId, sellerId: otherUserId };
    }

    if (role === Role.SELLER) {
      return { buyerId: otherUserId, sellerId: currentUserId };
    }

    throw new ForbiddenException('Rol no soportado para iniciar conversaciones');
  }
}
