import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Evidence, EvidenceSchema } from './evidence.schema';
import { DisputeReason } from '../enums/dispute-reason.enum';
import { DisputeStatus } from '../enums/dispute-status.enum';

@Schema({
  timestamps: { createdAt: true, updatedAt: true },
})
export class Dispute {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  orderId: string;

  @Prop({ required: true })
  itemOrderId: string;

  @Prop({ required: true, index: true })
  buyerId: string;

  @Prop({ required: true, index: true })
  sellerId: string;

  @Prop({ required: true, enum: Object.values(DisputeReason) })
  reason: DisputeReason;

  @Prop({ required: true, minlength: 50 })
  description: string;

  @Prop({
    required: true,
    enum: Object.values(DisputeStatus),
    default: DisputeStatus.ABIERTA,
    index: true,
  })
  status: DisputeStatus;

  @Prop()
  closedAt?: Date;

  @Prop()
  lastBuyerActivityAt?: Date;

  @Prop()
  lastSellerActivityAt?: Date;

  @Prop()
  deadlineAt?: Date;

  @Prop({ type: [EvidenceSchema], default: [] })
  evidences: Evidence[];

  createdAt: Date;
  updatedAt: Date;
}

export type DisputeDocument = HydratedDocument<Dispute>;

export const DisputeSchema = SchemaFactory.createForClass(Dispute);

DisputeSchema.index({ orderId: 1, itemOrderId: 1 }, { unique: true });
DisputeSchema.index({ createdAt: -1 });
