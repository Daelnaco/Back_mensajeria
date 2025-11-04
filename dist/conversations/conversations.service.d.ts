import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/message.entity';
import { CreateConversationMessageDto } from './dto/create-message.dto';
export declare class ConversationsService {
    private readonly convRepo;
    private readonly msgRepo;
    constructor(convRepo: Repository<Conversation>, msgRepo: Repository<ConversationMessage>);
    private assertMembership;
    postMessage(conversationId: number, dto: CreateConversationMessageDto, user: any): Promise<ConversationMessage>;
    listMessages(conversationId: number, user: any, cursor?: string, limit?: number): Promise<ConversationMessage[]>;
}
