import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(orderId: string, body: Omit<CreateMessageDto, 'orderId'>, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/message.schema").MessageDocument, {}, {}> & import("./schemas/message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMessages(orderId: string, query: GetMessagesQueryDto, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/message.schema").MessageDocument, {}, {}> & import("./schemas/message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
