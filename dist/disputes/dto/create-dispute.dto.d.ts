import { DisputeReason } from '../entities/dispute-reason.enum';
export declare class CreateDisputeDto {
    orderId: number;
    conversationId?: number;
    reason: DisputeReason;
    description?: string;
}
