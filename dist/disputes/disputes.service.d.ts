import { DataSource } from 'typeorm';
export declare class DisputesService {
    private readonly ds;
    constructor(ds: DataSource);
    open(conversationId: number | null, openerId: number, reason: string, orderId: number | null, description: string | null): Promise<any>;
    list({ status, scope, uid, }: {
        status?: string;
        scope: 'mine' | 'all';
        uid: number;
    }): Promise<any>;
    findById(id: number): Promise<any>;
    reply(id: number, userId: number, eventType?: string, note?: string, payload?: any): Promise<{
        ok: boolean;
        id: number;
        userId: number;
        eventType: string;
        note: string;
        payload: any;
    }>;
    close(id: number): Promise<{
        ok: boolean;
        id: number;
    }>;
    events(id: number): Promise<any[]>;
}
