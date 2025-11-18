export declare class ConversationOrmEntity {
    id: string;
    orderId?: number | null;
    buyerId: string;
    sellerId: string;
    lastActivityAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
