import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DisputesService } from '../disputes.service';
import {
  DISPUTE_MESSAGE_REPOSITORY,
  DISPUTE_REPOSITORY,
} from '../repositories/dispute.repository';
import { DISPUTE_EVIDENCE_REPOSITORY } from '../repositories/dispute-evidence.repository';
import { PURCHASE_REPOSITORY } from '../repositories/purchase.repository';
import { DisputeStatus } from '../entities/dispute-status.enum';

describe('DisputesService', () => {
  let service: DisputesService;
  const disputeRepository = {
    create: jest.fn(),
    findByBuyer: jest.fn(),
    findBySeller: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };
  const evidenceRepository = {
    createMany: jest.fn(),
  };
  const messageRepository = {
    addMessage: jest.fn(),
  };
  const purchaseRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };
  const emitter = { emit: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DisputesService,
        { provide: DISPUTE_REPOSITORY, useValue: disputeRepository },
        { provide: DISPUTE_EVIDENCE_REPOSITORY, useValue: evidenceRepository },
        { provide: DISPUTE_MESSAGE_REPOSITORY, useValue: messageRepository },
        { provide: PURCHASE_REPOSITORY, useValue: purchaseRepository },
        { provide: EventEmitter2, useValue: emitter },
      ],
    }).compile();

    service = moduleRef.get(DisputesService);

    jest.clearAllMocks();
  });

  describe('createDispute', () => {
    it('creates dispute when purchase belongs to buyer', async () => {
      purchaseRepository.findById.mockResolvedValue({
        id: 'purchase-1',
        buyerId: 'buyer-1',
        sellerId: 'seller-1',
        status: 'DELIVERED',
      });
      const dispute = {
        id: 'dispute-1',
        purchaseId: 'purchase-1',
        buyerId: 'buyer-1',
        sellerId: 'seller-1',
        status: DisputeStatus.OPEN,
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      disputeRepository.create.mockResolvedValue(dispute);

      const result = await service.createDispute('buyer-1', {
        purchaseId: 'purchase-1',
        description: 'Producto defectuoso',
        evidenceUrls: ['http://image'],
      });

      expect(result).toEqual(dispute);
      expect(purchaseRepository.updateStatus).toHaveBeenCalledWith(
        'purchase-1',
        'EN_DISPUTA',
      );
      expect(evidenceRepository.createMany).toHaveBeenCalled();
    });

    it('throws when purchase belongs to another user', async () => {
      purchaseRepository.findById.mockResolvedValue({
        id: 'purchase-1',
        buyerId: 'buyer-2',
        sellerId: 'seller-1',
        status: 'DELIVERED',
      });

      await expect(
        service.createDispute('buyer-1', {
          purchaseId: 'purchase-1',
          description: 'test',
        }),
      ).rejects.toThrow('No puedes abrir una disputa para esta compra');
    });
  });

  describe('replyToDispute', () => {
    it('allows seller to reply', async () => {
      disputeRepository.findById.mockResolvedValue({
        id: 'dispute-1',
        purchaseId: 'purchase-1',
        buyerId: 'buyer-1',
        sellerId: 'seller-1',
        status: DisputeStatus.OPEN,
        description: 'N/A',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const message = {
        id: 'msg-1',
        disputeId: 'dispute-1',
        senderId: 'seller-1',
        message: 'respuesta',
        attachments: [],
        createdAt: new Date(),
      };
      messageRepository.addMessage.mockResolvedValue(message);

      const result = await service.replyToDispute('dispute-1', 'seller-1', {
        message: 'respuesta',
      });

      expect(result).toEqual(message);
      expect(messageRepository.addMessage).toHaveBeenCalled();
    });
  });
});
