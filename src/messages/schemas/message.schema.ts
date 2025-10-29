import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  senderUserId: string;

  @Prop({ required: true, enum: ['text', 'image'] })
  type: 'text' | 'image';

  @Prop({ required: false })
  body?: string; // texto del mensaje o caption de la imagen

  @Prop({ type: [String], default: [] })
  attachments: string[]; // URLs de archivos/imagenes asociadas

  @Prop({
    required: true,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  })
  status: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
