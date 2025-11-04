import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages.dto';
export declare class MessagesService {
    private readonly messageModel;
    constructor(messageModel: Model<MessageDocument>);
    sendMessage(dto: CreateMessageDto, user: any): Promise<import("mongoose").Document<unknown, {}, MessageDocument, {}, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMessagesForOrder(orderId: string, query: GetMessagesQueryDto, user: any): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
