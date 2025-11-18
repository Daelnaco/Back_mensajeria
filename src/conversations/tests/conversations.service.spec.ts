import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationsService } from '../conversations.service';
import {
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_REPOSITORY,
} from '../repositories/conversation.repository';
import { Role } from '../../common/enums/role.enum';

describe('ConversationsService', () => {
  let service: ConversationsService;
  const conversationRepository = {
    findExistingConversation: jest.fn(),
    create: jest.fn(),
    listUserConversations: jest.fn(),
    findById: jest.fn(),
  };
  const messageRepository = {
    create: jest.fn(),
    findByConversation: jest.fn(),
  };
  const emitter = { emit: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: CONVERSATION_REPOSITORY, useValue: conversationRepository },
        { provide: CONVERSATION_MESSAGE_REPOSITORY, useValue: messageRepository },
        { provide: EventEmitter2, useValue: emitter },
      ],
    }).compile();

    service = moduleRef.get(ConversationsService);
    jest.clearAllMocks();
  });

  it('creates a new conversation when none exists', async () => {
    conversationRepository.findExistingConversation.mockResolvedValue(null);
    const conversation = {
      id: 'conv-1',
      buyerId: 'buyer-1',
      sellerId: 'seller-1',
      orderId: null,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversationRepository.create.mockResolvedValue(conversation);

    const result = await service.getOrCreateConversation('buyer-1', Role.BUYER, {
      otherUserId: 'seller-1',
    });

    expect(result).toEqual(conversation);
    expect(conversationRepository.create).toHaveBeenCalled();
  });

  it('reuses existing conversation', async () => {
    const conversation = {
      id: 'conv-1',
      buyerId: 'buyer-1',
      sellerId: 'seller-1',
      orderId: null,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversationRepository.findExistingConversation.mockResolvedValue(conversation);

    const result = await service.getOrCreateConversation('buyer-1', Role.BUYER, {
      otherUserId: 'seller-1',
    });

    expect(result).toEqual(conversation);
    expect(conversationRepository.create).not.toHaveBeenCalled();
  });

  it('sends message when user participates', async () => {
    conversationRepository.findById.mockResolvedValue({
      id: 'conv-1',
      buyerId: 'buyer-1',
      sellerId: 'seller-1',
      orderId: null,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const message = {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'buyer-1',
      senderRole: Role.BUYER,
      type: 'text' as const,
      text: 'hola',
      attachments: [],
      createdAt: new Date(),
    };
    messageRepository.create.mockResolvedValue(message);

    const result = await service.sendMessage('conv-1', 'buyer-1', { text: 'hola' });
    expect(result).toEqual(message);
    expect(messageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        senderRole: Role.BUYER,
        type: 'text',
        text: 'hola',
      }),
    );
  });
});
