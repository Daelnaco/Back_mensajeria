import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private readonly chats;
    constructor(chats: Repository<Chat>);
    private forbiddenWords;
    create(createMessageDto: CreateMessageDto, user: any): Promise<Chat>;
    findFlagged(): Promise<Chat[]>;
    softDelete(id: string, user: any): Promise<{
        success: boolean;
    }>;
    findAll(user: any): Promise<Chat[]>;
    findByOrder(orderId: string): Promise<Chat[]>;
    findByPost(postId: string): Promise<Chat[]>;
}
