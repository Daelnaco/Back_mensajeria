export declare const PURCHASE_REPOSITORY: unique symbol;
export interface Purchase {
    id: string;
    buyerId: string;
    sellerId: string;
    status: string;
}
export interface PurchaseRepository {
    findById(id: string): Promise<Purchase | null>;
    updateStatus(id: string, status: string): Promise<void>;
}
