import { DisputeReason } from '../../entities/dispute-reason.enum';
import { DisputeStatus } from '../../entities/dispute-status.enum';
export declare class DisputeOrmEntity {
    id: string;
    conversationId?: string | null;
    orderId?: number | null;
    openerId: string;
    reason: DisputeReason;
    description?: string | null;
    status: DisputeStatus;
    openedAt: Date;
    closedAt?: Date | null;
    updatedAt: Date;
    deletedAt?: Date | null;
}
