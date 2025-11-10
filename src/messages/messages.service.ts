import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Chat)
    private readonly chats: Repository<Chat>,
  ) {}

  private forbiddenWords = ['spam', 'insulto', 'grosería'];

  async create(createMessageDto: CreateMessageDto, user: any) {
    // Moderación
    let isVisible = true;
    let isFlagged = false;

    if (this.forbiddenWords.some((w) => (createMessageDto.content ?? '').toLowerCase().includes(w))) {
      isVisible = false;
      isFlagged = true;
    }

    const entity = this.chats.create({
      
      contenido: createMessageDto.content,
      senderId: Number(user.id),                   
      orderId: createMessageDto.orderId ? Number(createMessageDto.orderId) : null,
      postId: createMessageDto.postId ? Number(createMessageDto.postId) : null,

      isVisible,
      isFlagged,
      isDeleted: false,

    });

    return this.chats.save(entity);
  }

  async findFlagged() {
    return this.chats.find({
      where: { isFlagged: true },
      order: { createdAt: 'DESC' as const },
    });
  }

  async softDelete(id: string, user: any) {
    const idNum = Number(id);
    const message = await this.chats.findOne({ where: { idChat: idNum } });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    
    const isOwner = Number(message.senderId) === Number(user.id);
    const isAdmin = user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Not allowed');
    }

    message.isDeleted = true;
    await this.chats.save(message);
    return { success: true };
  }

  async findAll(user: any) {
    const isAdmin = user?.role === 'admin';
    if (isAdmin) {
      return this.chats.find({ order: { createdAt: 'DESC' as const } });
    }
    return this.chats.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findByOrder(orderId: string) {
    return this.chats.find({
      where: {
        orderId: Number(orderId),
        isDeleted: false,
        isVisible: true,
      },
      order: { createdAt: 'ASC' as const }, // o fechaMensaje: 'ASC'
    });
  }

  async findByPost(postId: string) {
    return this.chats.find({
      where: {
        postId: Number(postId),
        isDeleted: false,
        isVisible: true,
      },
      order: { createdAt: 'ASC' as const },
    });
  }
}
