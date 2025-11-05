import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
export declare class MessagesController {
    private readonly svc;
    constructor(svc: MessagesService);
    send(cid: string, req: any, dto: CreateMessageDto): Promise<{
        ok: boolean;
    }>;
    list(cid: string, afterTs?: string, afterId?: string): Promise<any>;
    remove(messageId: string, req: any): Promise<{
        ok: boolean;
    }>;
}
export declare class MessagesModerationController {
    private readonly svc;
    constructor(svc: MessagesService);
    flag(id: string, req: any, dto: UpdateMessageDto): Promise<{
        ok: boolean;
    }>;
    flagged(limit?: string): Promise<any>;
}
