import { Injectable, ForbiddenException, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument, } from './schemas/conversation.schema';
import { Message, MessageDocument } from '../messages/schemas/message.schema';
import { ConversationCreateMessageDto } from './dto/create-message.dto';

// placeholder que simula autorización:
// en la versión final debería validar que ambos userA y userB tengan relación con la orden.
function userAllowedForOrder(orderId: string, userId: string) {
  return true;
}

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  /**
   * Crear (o reutilizar) una conversación entre el usuario actual (sender)
   * y otherUserId sobre una orderId, y guardar el mensaje enviado.
   * Esto cubre el caso "inicio de conversación" + "envío de mensaje".
   */
  async sendMessageInConversation(
    dto: ConversationCreateMessageDto,
    senderUser: any,
  ) {
    if (!userAllowedForOrder(dto.orderId, senderUser.id)) {
      throw new ForbiddenException(
        'No puedes iniciar conversación sobre esta orden',
      );
    }

    // ordenamos consistentemente los dos participantes para no duplicar
    // conversaciones (A-B es lo mismo que B-A para la misma orderId)
    const [userAId, userBId] =
      senderUser.id < dto.otherUserId
        ? [senderUser.id, dto.otherUserId]
        : [dto.otherUserId, senderUser.id];

    // buscamos si ya existe conversación entre estas dos personas sobre esa orden
    let conversation = await this.conversationModel.findOne({
      orderId: dto.orderId,
      userAId,
      userBId,
    });

    const now = new Date();

    // si no existe, la creamos
    if (!conversation) {
      conversation = await this.conversationModel.create({
        orderId: dto.orderId,
        userAId,
        userBId,
        lastActivityAt: now,
      });
    }

    // guardamos el mensaje en la colección messages (reusamos el esquema Message)
    const msg = await this.messageModel.create({
      orderId: dto.orderId,
      senderUserId: senderUser.id,
      type: dto.type,
      body: dto.body ?? '',
      attachments: dto.attachments ?? [],
      status: 'sent',
    });

    // actualizamos lastActivityAt para esta conversación
    conversation.lastActivityAt = now;
    await conversation.save();

    return {
      conversationId: conversation._id.toString(),
      message: msg,
    };
  }

  /**
   * Listar las conversaciones en las que participa el usuario autenticado.
   */
  async listMyConversations(userId: string) {
    const conversations = await this.conversationModel
      .find({
        $or: [{ userAId: userId }, { userBId: userId }],
      })
      .sort({ lastActivityAt: -1 }); // más reciente primero

    return conversations;
  }

  /**
   * Obtener una conversación específica (por ejemplo para ver info encabezado de chat).
   */
  async getConversationByOrder(orderId: string, userId: string) {
    const convo = await this.conversationModel.findOne({
      orderId,
      $or: [{ userAId: userId }, { userBId: userId }],
    });

    if (!convo) {
      throw new NotFoundException('Conversación no encontrada');
    }

    return convo;
  }
}
