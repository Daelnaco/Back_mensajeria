import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { Role } from '../common/enums/role.enum';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { SendConversationMessageDto } from './dto/send-message.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    getOrCreate(user: {
        userId: string;
        role: Role;
    }, payload: CreateConversationDto): Promise<import("./entities/conversation.entity").Conversation>;
    list(user: {
        userId: string;
    }, pagination: PaginationQueryDto): Promise<import("../common/interfaces/pagination-result.interface").PaginationResult<import("./entities/conversation.entity").Conversation>>;
    listMessages(id: string, user: {
        userId: string;
    }, pagination: ListMessagesQueryDto): Promise<import("../common/interfaces/pagination-result.interface").PaginationResult<import("./entities/conversation.entity").ConversationMessage>>;
    sendMessage(id: string, user: {
        userId: string;
    }, payload: SendConversationMessageDto): Promise<import("./entities/conversation.entity").ConversationMessage>;
}
