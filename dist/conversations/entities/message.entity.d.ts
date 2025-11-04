import { Conversation } from './conversation.entity';
export type MessageType = 'text' | 'image';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export declare class ConversationMessage {
    id: number;
    conversation: Conversation;
    senderId: number;
    type: MessageType;
    body?: string;
    imageUrl?: string;
    imageCaption?: string;
    status: MessageStatus;
    creadoEn: Date;
}
