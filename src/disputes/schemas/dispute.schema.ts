import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ required: false })
  orderId?: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ required: true, enum: ['ABIERTO', 'EN_REVISION', 'CERRADO'], default: 'ABIERTO' })
  status: string;

  @Prop({ required: true })
  createdByUserId: string;

  @Prop()
  createdByIp?: string;

  @Prop()
  createdByUserAgent?: string;

  @Prop({ required: true })
  lastActivityAt: Date;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
