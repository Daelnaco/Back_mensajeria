import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages.dto';

// Aquí deberías validar si el usuario realmente pertenece a la orden (buyer / seller).
// Eso viene de otro squad. De momento devolvemos true para no bloquear la demo.
async function canUserAccessOrder(orderId: string, userId: string) {
  // TODO: integrar con microservicio de órdenes.
  return true;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  // HU-03: Enviar mensaje en el chat de una orden
  async sendMessage(dto: CreateMessageDto, user: any) {
    // 1. validar que este usuario puede hablar sobre esta orden
    const allowed = await canUserAccessOrder(dto.orderId, user.id);
    if (!allowed) {
      throw new ForbiddenException(
        'No puedes enviar mensajes para esta orden',
      );
    }

    // 2. crear el mensaje con estado inicial 'sent'
    const msg = await this.messageModel.create({
      orderId: dto.orderId,
      senderUserId: user.id,
      type: dto.type,
      body: dto.body ?? '',
      attachments: dto.attachments ?? [],
      status: 'sent',
    });

    // (Opcional) aquí podrías notificar, actualizar "última actividad" de la orden, etc.

    return msg;
  }

  // HU-03: Obtener mensajes de la orden con paginación por cursor
  async getMessagesForOrder(
    orderId: string,
    query: GetMessagesQueryDto,
    user: any,
  ) {
    const allowed = await canUserAccessOrder(orderId, user.id);
    if (!allowed) {
      throw new ForbiddenException(
        'No puedes ver los mensajes de esta orden',
      );
    }

    const mongoQuery: FilterQuery<MessageDocument> = {
      orderId,
    };

    // Soportar cursor (mensajes posteriores a cierta fecha)
    if (query.cursor) {
      const cursorDate = new Date(query.cursor);
      if (!isNaN(cursorDate.valueOf())) {
        mongoQuery.createdAt = { $gt: cursorDate };
      }
    }

    // Límite
    const limit = query.limit ? parseInt(query.limit, 10) : 20;

    const messages = await this.messageModel
      .find(mongoQuery)
      .sort({ createdAt: 1 }) // ASC: más antiguo -> más nuevo
      .limit(limit);

    return messages;
  }
}
