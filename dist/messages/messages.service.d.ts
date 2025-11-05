import { DataSource } from 'typeorm';
export type MessageRole = 'buyer' | 'seller' | 'moderator';
export declare class MessagesService {
    private readonly ds;
    constructor(ds: DataSource);
    send(conversationId: number, senderId: number, role: MessageRole, body: string): Promise<{
        ok: boolean;
    }>;
    list(conversationId: number, after?: {
        ts: string;
        id: number;
    }, limit?: number): Promise<any>;
    softDelete(messageId: number, actorId: number): Promise<{
        ok: boolean;
    }>;
    getOne(messageId: number): Promise<any>;
    flag(messageId: number, reason: string, actorId: number): Promise<{
        ok: boolean;
    }>;
    listFlagged(limit?: number): Promise<any>;
}
