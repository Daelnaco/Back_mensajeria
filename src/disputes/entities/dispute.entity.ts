import { DisputeReason } from './dispute-reason.enum';
import { DisputeStatus } from './dispute-status.enum';

export interface Dispute {
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
