import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { ConversationsController } from '../src/conversations/conversations.controller';
import { ConversationsService } from '../src/conversations/conversations.service';
import {
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_REPOSITORY,
  ConversationMessageRepository,
  ConversationRepository,
} from '../src/conversations/repositories/conversation.repository';
import { Conversation, ConversationMessage } from '../src/conversations/entities/conversation.entity';
import { PaginationResult } from '../src/common/interfaces/pagination-result.interface';
import { PaginationQueryDto } from '../src/common/dtos/pagination-query.dto';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { TestAuthGuard } from './utils/test-auth.guard';

class InMemoryConversationRepository implements ConversationRepository {
  private conversations: Conversation[] = [];

  async findExistingConversation(
    buyerId: string,
    sellerId: string,
    productId?: string,
    orderId?: string,
  ): Promise<Conversation | null> {
    return (
      this.conversations.find(
        (conversation) =>
          conversation.buyerId === buyerId &&
          conversation.sellerId === sellerId &&
          conversation.productId === (productId ?? null) &&
          conversation.orderId === (orderId ?? null),
      ) ?? null
    );
  }

  async create(
    conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Conversation> {
    const entity: Conversation = {
      ...conversation,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(entity);
    return entity;
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversations.find((conversation) => conversation.id === id) ?? null;
  }

  async listUserConversations(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Conversation>> {
    const data = this.conversations.filter(
      (conversation) => conversation.buyerId === userId || conversation.sellerId === userId,
    );
    return {
      data,
      total: data.length,
      skip: pagination.skip ?? 0,
      limit: pagination.limit ?? 20,
    };
  }
}

class InMemoryConversationMessageRepository implements ConversationMessageRepository {
  private messages: ConversationMessage[] = [];

  async create(
    message: Omit<ConversationMessage, 'id' | 'createdAt'>,
  ): Promise<ConversationMessage> {
    const entity: ConversationMessage = {
      ...message,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.messages.push(entity);
    return entity;
  }

  async findByConversation(
    conversationId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<ConversationMessage>> {
    const filtered = this.messages.filter(
      (message) => message.conversationId === conversationId,
    );
    const data = filtered.slice(
      pagination.skip ?? 0,
      (pagination.skip ?? 0) + (pagination.limit ?? 20),
    );
    return {
      data,
      total: filtered.length,
      skip: pagination.skip ?? 0,
      limit: pagination.limit ?? 20,
    };
  }
}

describe('ConversationsController (e2e)', () => {
  let app: INestApplication;
  const buyerId = '11111111-1111-4111-8111-111111111111';
  const sellerId = '22222222-2222-4222-8222-222222222222';
  const productId = '44444444-4444-4444-8444-444444444444';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        ConversationsService,
        RolesGuard,
        { provide: CONVERSATION_REPOSITORY, useClass: InMemoryConversationRepository },
        { provide: CONVERSATION_MESSAGE_REPOSITORY, useClass: InMemoryConversationMessageRepository },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates or returns existing conversation', async () => {
    const response = await request(app.getHttpServer())
      .post('/conversations')
      .set('x-user-id', buyerId)
      .set('x-user-role', 'buyer')
      .send({
        otherUserId: sellerId,
        productId,
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
  });

  it('sends and lists messages', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/conversations')
      .set('x-user-id', buyerId)
      .set('x-user-role', 'buyer')
      .send({
        otherUserId: sellerId,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/conversations/${body.id}/messages`)
      .set('x-user-id', buyerId)
      .set('x-user-role', 'buyer')
      .send({ text: 'Hola' })
      .expect(201);

    const messages = await request(app.getHttpServer())
      .get(`/conversations/${body.id}/messages`)
      .set('x-user-id', sellerId)
      .set('x-user-role', 'seller')
      .expect(200);

    expect(messages.body.data).toHaveLength(1);
  });
});
