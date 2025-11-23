import { Injectable, Logger } from '@nestjs/common';
import { Dispute } from './schemas/dispute.schema';
import { DisputeMessage } from './schemas/dispute-message.schema';

@Injectable()
export class DomainEventsService {
  private readonly logger = new Logger('DomainEvents');

  emitDisputeOpened(dispute: Dispute) {
    this.emit('DisputeOpened', {
      disputeId: dispute._id?.toString(),
      buyerId: dispute.buyerId,
      sellerId: dispute.sellerId,
      orderId: dispute.orderId,
      itemOrderId: dispute.itemOrderId,
    });
  }

  emitDisputeResolved(dispute: Dispute) {
    this.emit('DisputeResolved', {
      disputeId: dispute._id?.toString(),
      status: dispute.status,
      buyerId: dispute.buyerId,
      sellerId: dispute.sellerId,
    });
  }

  emitDisputeClosed(dispute: Dispute) {
    this.emit('DisputeClosed', {
      disputeId: dispute._id?.toString(),
      status: dispute.status,
    });
  }

  emitDisputeMessageCreated(dispute: Dispute, message: DisputeMessage) {
    this.emit('DisputeMessageCreated', {
      disputeId: dispute._id?.toString(),
      messageId: message._id?.toString(),
      senderId: message.senderId,
      senderRole: message.senderRole,
    });
  }

  private emit(event: string, payload: Record<string, any>) {
    this.logger.log(
      `[${event}] ${JSON.stringify({
        ...payload,
        emittedAt: new Date().toISOString(),
      })}`,
    );
  }
}
