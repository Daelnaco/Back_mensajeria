import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string; // ID del usuario que creó el mensaje

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: false })
  isFlagged: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: false })
  orderId?: string;

  @Prop({ required: false })
  postId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
