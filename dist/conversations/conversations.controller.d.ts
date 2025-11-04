import { ConversationsService } from './conversations.service';
import { ConversationCreateMessageDto } from './dto/create-message.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    startConversationAndSend(dto: ConversationCreateMessageDto, req: any): Promise<{
        conversationId: string;
        message: import("mongoose").Document<unknown, {}, import("../messages/schemas/message.schema").MessageDocument, {}, {}> & import("../messages/schemas/message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    myConversations(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").ConversationDocument, {}, {}> & import("./schemas/conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getByOrder(orderId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/conversation.schema").ConversationDocument, {}, {}> & import("./schemas/conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
