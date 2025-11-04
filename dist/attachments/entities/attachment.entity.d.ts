import { ConversationMessage } from '../../conversations/entities/message.entity';
export declare class Attachment {
    id: number;
    message?: ConversationMessage;
    storagePath: string;
    mimeType: string;
    size: number;
    thumbnailPath?: string;
    createdAt: Date;
}
