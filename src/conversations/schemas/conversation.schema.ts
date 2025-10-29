import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

/**
 * Conversation model:
 * Representa el “hilo” de chat asociado a una orden entre dos usuarios.
 * También nos deja guardar lastActivityAt para ordenar/construir inbox.
 */
@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  orderId: string;

  // participantes
  @Prop({ required: true })
  userAId: string;

  @Prop({ required: true })
  userBId: string;

  // última actividad (último mensaje enviado)
  @Prop({ required: true })
  lastActivityAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
