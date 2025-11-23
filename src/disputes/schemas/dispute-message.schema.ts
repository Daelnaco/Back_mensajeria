import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Evidence, EvidenceSchema } from './evidence.schema';
import { DisputeParticipantRole } from '../enums/participant-role.enum';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
})
export class DisputeMessage {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Dispute', required: true, index: true })
  disputeId: Types.ObjectId;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true, enum: Object.values(DisputeParticipantRole) })
  senderRole: DisputeParticipantRole;

  @Prop()
  content?: string;

  @Prop({ type: [EvidenceSchema], default: [] })
  evidences: Evidence[];

  @Prop({ type: [String], default: [] })
  readBy: string[];

  createdAt: Date;
}

export type DisputeMessageDocument = HydratedDocument<DisputeMessage>;
export const DisputeMessageSchema = SchemaFactory.createForClass(DisputeMessage);
DisputeMessageSchema.index({ disputeId: 1, createdAt: -1 });
