import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
export declare class ConversationsController {
    private readonly svc;
    constructor(svc: ConversationsService);
    create(req: any, dto: CreateConversationDto): Promise<{
        id: any;
        buyerId: number;
        sellerId: number;
    }>;
    list(req: any): Promise<any>;
    find(id: string): Promise<any>;
}
