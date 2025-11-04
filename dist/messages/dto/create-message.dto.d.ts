export declare class CreateMessageDto {
    orderId: string;
    type: 'text' | 'image';
    body?: string;
    attachments?: string[];
}
