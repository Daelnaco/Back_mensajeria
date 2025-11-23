import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class DisputeAccessLog {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Dispute', required: true })
  disputeId: Types.ObjectId;

  @Prop({ required: true })
  attemptedAction: string;

  createdAt: Date;
}

export type DisputeAccessLogDocument = HydratedDocument<DisputeAccessLog>;
export const DisputeAccessLogSchema =
  SchemaFactory.createForClass(DisputeAccessLog);
