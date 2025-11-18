import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from '../common/enums/role.enum';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { PaginationResult } from '../common/interfaces/pagination-result.interface';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { SendConversationMessageDto } from './dto/send-message.dto';
import { ConversationMessageRepository, ConversationRepository } from './repositories/conversation.repository';
import { Conversation, ConversationMessage } from './entities/conversation.entity';
export declare class ConversationsService {
    private readonly conversationRepository;
    private readonly messageRepository;
    private readonly eventEmitter;
    constructor(conversationRepository: ConversationRepository, messageRepository: ConversationMessageRepository, eventEmitter: EventEmitter2);
    getOrCreateConversation(currentUserId: string, role: Role, payload: CreateConversationDto): Promise<Conversation>;
    listUserConversations(userId: string, pagination: PaginationQueryDto): Promise<PaginationResult<Conversation>>;
    listMessages(conversationId: string, userId: string, pagination: ListMessagesQueryDto): Promise<PaginationResult<ConversationMessage>>;
    sendMessage(conversationId: string, userId: string, payload: SendConversationMessageDto): Promise<ConversationMessage>;
    private ensureParticipant;
    private resolveParticipants;
}
