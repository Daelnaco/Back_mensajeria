export declare class ConversationCreateMessageDto {
    orderId: string;
    type: 'text' | 'image';
    body?: string;
    attachments?: string[];
    otherUserId: string;
}
