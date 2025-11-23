import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: { createdAt: true, updatedAt: false } })
export class Evidence {
  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  sizeBytes: number;

  @Prop()
  signature?: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export type EvidenceDocument = HydratedDocument<Evidence>;
export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
