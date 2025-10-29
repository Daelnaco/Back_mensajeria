import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Prop({ required: true })
  ownerUserId: string; // quién subió el archivo

  @Prop({ required: true })
  filename: string; // nombre físico guardado

  @Prop({ required: true })
  mimeType: string; // ej. "image/jpeg"

  @Prop({ required: true })
  size: number; // bytes

  @Prop({ required: true })
  url: string; // ruta pública o path accesible

  // Estas dos propiedades las agrega timestamps:true en runtime,
  // pero las declaramos para que TS esté feliz.
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
