import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeEventDocument = DisputeEvent & Document;

@Schema({ timestamps: true })
export class DisputeEvent {
  @Prop({ type: Types.ObjectId, ref: 'Dispute', required: true })
  disputeId: string;

  @Prop({ required: true, enum: ['CREATED', 'REPLIED'] })
  eventType: string;

  @Prop({ required: true })
  actorUserId: string;

  @Prop()
  message?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const DisputeEventSchema = SchemaFactory.createForClass(DisputeEvent);
