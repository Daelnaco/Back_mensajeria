import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as request from 'supertest';
import { DisputesController } from '../src/disputes/disputes.controller';
import { DisputesService } from '../src/disputes/disputes.service';
import {
  DISPUTE_REPOSITORY,
  DisputeRepository,
} from '../src/disputes/repositories/dispute.repository';
import { Dispute } from '../src/disputes/entities/dispute.entity';
import { DisputeStatus } from '../src/disputes/entities/dispute-status.enum';
import { DisputeReason } from '../src/disputes/entities/dispute-reason.enum';
import { PaginationResult } from '../src/common/interfaces/pagination-result.interface';
import { PaginationQueryDto } from '../src/common/dtos/pagination-query.dto';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { TestAuthGuard } from './utils/test-auth.guard';

class InMemoryDisputeRepository implements DisputeRepository {
  private disputes: Dispute[] = [];
  private sequence = 1;

  async create(payload: Omit<Dispute, 'id' | 'openedAt' | 'updatedAt'>): Promise<Dispute> {
    const dispute: Dispute = {
      ...payload,
      id: String(this.sequence++),
      openedAt: new Date(),
      updatedAt: new Date(),
    };
    this.disputes.push(dispute);
    return dispute;
  }

  async save(dispute: Dispute): Promise<Dispute> {
    const index = this.disputes.findIndex((d) => d.id === dispute.id);
    this.disputes[index] = dispute;
    return dispute;
  }

  async findById(id: string): Promise<Dispute | null> {
    return this.disputes.find((d) => d.id === id) ?? null;
  }

  async findByOpener(
    openerId: string,
    filters: PaginationQueryDto & { status?: DisputeStatus },
  ): Promise<PaginationResult<Dispute>> {
    const data = this.disputes.filter(
      (dispute) => dispute.openerId === openerId && (!filters.status || dispute.status === filters.status),
    );
    return {
      data,
      total: data.length,
      skip: filters.skip ?? 0,
      limit: filters.limit ?? 20,
    };
  }

  async findByParticipant(
    participantId: string,
    filters: PaginationQueryDto & { status?: DisputeStatus },
  ): Promise<PaginationResult<Dispute>> {
    return this.findByOpener(participantId, filters);
  }

  async updateStatus(id: string, status: DisputeStatus): Promise<void> {
    const dispute = await this.findById(id);
    if (dispute) {
      dispute.status = status;
    }
  }
}

describe('DisputesController (e2e)', () => {
  let app: INestApplication;
  const openerId = '1001';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DisputesController],
      providers: [
        DisputesService,
        RolesGuard,
        { provide: DISPUTE_REPOSITORY, useClass: InMemoryDisputeRepository },
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

  it('creates and lists disputes for opener', async () => {
    await request(app.getHttpServer())
      .post('/disputes')
      .set('x-user-id', openerId)
      .set('x-user-role', 'buyer')
      .send({
        orderId: 5001,
        reason: DisputeReason.NOT_RECEIVED,
        description: 'El pedido no llegó a tiempo',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/disputes/my')
      .set('x-user-id', openerId)
      .set('x-user-role', 'buyer')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
  });
});
