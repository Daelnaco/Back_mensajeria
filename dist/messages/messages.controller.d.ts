import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getFlaggedMessages(): Promise<import("./entities/chat.entity").Chat[]>;
    softDelete(id: string, req: any): Promise<{
        success: boolean;
    }>;
    getByOrder(orderId: string): Promise<import("./entities/chat.entity").Chat[]>;
    getByPost(postId: string): Promise<import("./entities/chat.entity").Chat[]>;
}
