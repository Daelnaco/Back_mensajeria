import { DataSource } from 'typeorm';
export declare class ConversationsService {
    private readonly ds;
    constructor(ds: DataSource);
    create(buyerId: number, sellerId: number): Promise<{
        id: any;
        buyerId: number;
        sellerId: number;
    }>;
    listByUser(userId: number): Promise<any>;
    findById(id: number): Promise<any>;
}
