import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from '../messages/schemas/message.schema';
import { ConversationCreateMessageDto } from './dto/create-message.dto';
export declare class ConversationsService {
    private readonly conversationModel;
    private readonly messageModel;
    constructor(conversationModel: Model<ConversationDocument>, messageModel: Model<MessageDocument>);
    sendMessageInConversation(dto: ConversationCreateMessageDto, senderUser: any): Promise<{
        conversationId: string;
        message: import("mongoose").Document<unknown, {}, MessageDocument, {}, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    listMyConversations(userId: string): Promise<(import("mongoose").Document<unknown, {}, ConversationDocument, {}, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getConversationByOrder(orderId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, ConversationDocument, {}, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
