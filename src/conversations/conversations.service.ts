import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/message.entity';
import { CreateConversationMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation) private readonly convRepo: Repository<Conversation>,
    @InjectRepository(ConversationMessage) private readonly msgRepo: Repository<ConversationMessage>,
  ) {}

  private async assertMembership(conversationId: number, userId: number) {
    const c = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!c) throw new NotFoundException('Conversación no existe');
    if (![c.buyerId, c.sellerId].includes(userId)) {
      throw new ForbiddenException('No perteneces a esta conversación');
    }
    return c;
  }

  async postMessage(conversationId: number, dto: CreateConversationMessageDto, user: any) {
    const conv = await this.assertMembership(conversationId, Number(user.id));
    if (!conv.idPedido && !conv.idPublicacion) {
      throw new BadRequestException('Conversación debe estar ligada a pedido o publicación');
    }
    if (dto.type === 'text' && !dto.body) {
      throw new BadRequestException('Mensaje de texto sin body');
    }
    if (dto.type === 'image' && !dto.imageUrl) {
      throw new BadRequestException('Mensaje de imagen sin URL');
    }

    const entity = this.msgRepo.create({
      conversation: conv,
      senderId: Number(user.id),
      type: dto.type,
      body: dto.body,
      imageUrl: dto.imageUrl,
      imageCaption: dto.imageCaption,
      status: 'sent',
    });
    const saved = await this.msgRepo.save(entity);

    await this.convRepo.update({ id: conv.id }, { actualizadoEn: new Date() });

    return saved;
  }

  // paginación con cursor: cursor=ISODate; devuelve mensajes > cursor en orden creciente
  async listMessages(conversationId: number, user: any, cursor?: string, limit = 20) {
    await this.assertMembership(conversationId, Number(user.id));
    const whereBase = { conversation: { id: conversationId } } as any;

    const where = cursor ? { ...whereBase, creadoEn: MoreThan(new Date(cursor)) } : whereBase;

    return this.msgRepo.find({
      where,
      order: { creadoEn: 'ASC' },
      take: Math.min(limit, 100),
    });
  }
}
