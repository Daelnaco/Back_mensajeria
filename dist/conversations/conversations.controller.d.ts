import { ConversationsService } from './conversations.service';
import { CreateConversationMessageDto } from './dto/create-message.dto';
export declare class ConversationsController {
    private readonly svc;
    constructor(svc: ConversationsService);
    postMessage(id: string, dto: CreateConversationMessageDto): Promise<import("./entities/message.entity").ConversationMessage>;
    list(id: string, cursor?: string, limit?: string): Promise<import("./entities/message.entity").ConversationMessage[]>;
}
