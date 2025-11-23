import { Types, Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Dispute, DisputeDocument } from './schemas/dispute.schema';
import {
  DisputeMessage,
  DisputeMessageDocument,
} from './schemas/dispute-message.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { CreateDisputeMessageDto } from './dto/create-dispute-message.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { DisputeStatus } from './enums/dispute-status.enum';
import { DisputeReason } from './enums/dispute-reason.enum';
import { DisputeParticipantRole } from './enums/participant-role.enum';
import { OrdersService } from './orders.service';
import { DomainEventsService } from './domain-events.service';
import { DisputeAccessLogsService } from './services/dispute-access-logs.service';

const MAX_MESSAGE_TOTAL_BYTES = 20 * 1024 * 1024;

@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(
    @InjectModel(Dispute.name)
    private readonly disputeModel: Model<DisputeDocument>,
    @InjectModel(DisputeMessage.name)
    private readonly messageModel: Model<DisputeMessageDocument>,
    private readonly ordersService: OrdersService,
    private readonly domainEvents: DomainEventsService,
    private readonly accessLogs: DisputeAccessLogsService,
  ) {}

  async createDispute(dto: CreateDisputeDto, user: any) {
    this.ensureBuyer(user?.role);
    const initialTotal =
      dto.evidences?.reduce((acc, ev) => acc + (ev.sizeBytes ?? 0), 0) ?? 0;
    if (initialTotal > MAX_MESSAGE_TOTAL_BYTES) {
      throw new BadRequestException('Límite de 20MB de evidencias excedido');
    }

    const orderContext = await this.ordersService.validateOrderForDispute(
      user.userId,
      dto.orderId,
      dto.itemOrderId,
    );

    const existing = await this.disputeModel
      .findOne({ orderId: dto.orderId, itemOrderId: dto.itemOrderId })
      .lean();
    if (existing) {
      throw new ConflictException(
        'Ya existe una disputa para este ítem de la orden',
      );
    }

    let dispute: DisputeDocument;
    try {
      dispute = await this.disputeModel.create({
        orderId: dto.orderId,
        itemOrderId: dto.itemOrderId,
        buyerId: user.userId,
        sellerId: orderContext.sellerId,
        reason: dto.reason as DisputeReason,
        description: dto.description,
        status: DisputeStatus.ABIERTA,
        evidences: dto.evidences ?? [],
        lastBuyerActivityAt: new Date(),
        deadlineAt: this.buildDeadline(),
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException(
          'Ya existe una disputa para este ítem de la orden',
        );
      }
      throw err;
    }

    this.domainEvents.emitDisputeOpened(dispute);
    return dispute;
  }

  async listDisputes(query: any, user: any) {
    const role = this.normalizeRole(query.role ?? user?.role);
    if (role === 'unknown') {
      throw new ForbiddenException('Rol no autorizado para disputas');
    }
    const filter: any = {};

    if (role === DisputeParticipantRole.BUYER) {
      filter.buyerId = user.userId;
    } else if (role === DisputeParticipantRole.SELLER) {
      filter.sellerId = user.userId;
    }

    if (query && typeof query.parsedStatuses === 'function') {
      const statuses = query.parsedStatuses();
      if (statuses?.length) {
        filter.status = { $in: statuses };
      }
    } else if (query.status) {
      filter.status = { $in: String(query.status).split(',') };
    }

    const page = Number(query.page ?? 1);
    const limit = Math.min(Number(query.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.disputeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.disputeModel.countDocuments(filter),
    ]);

    return {
      data: items,
      pagination: { page, limit, total },
    };
  }

  async getDisputeDetail(
    id: string,
    user: any,
    opts?: { page?: number; limit?: number },
  ) {
    const dispute = await this.findByIdOrFail(id);
    const role = await this.assertAccess(dispute, user, 'READ_DETAIL');

    const page = Number(opts?.page ?? 1);
    const limit = Math.min(Number(opts?.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const messages = await this.messageModel
      .find({ disputeId: dispute._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    let orderSummary: any;
    try {
      orderSummary = await this.ordersService.validateOrderForDispute(
        dispute.buyerId,
        dispute.orderId,
        dispute.itemOrderId,
      );
    } catch (err) {
      orderSummary = null;
    }

    return { dispute, messages, viewerRole: role, orderSummary };
  }

  async sendMessage(
    disputeId: string,
    dto: CreateDisputeMessageDto,
    user: any,
  ) {
    if (!dto.content && (!dto.evidences || dto.evidences.length === 0)) {
      throw new BadRequestException('Contenido o evidencias son requeridos');
    }

    const totalSize =
      dto.evidences?.reduce((acc, ev) => acc + (ev.sizeBytes ?? 0), 0) ?? 0;
    if (totalSize > MAX_MESSAGE_TOTAL_BYTES) {
      throw new BadRequestException('Límite de 20MB de evidencias excedido');
    }

    const dispute = await this.findByIdOrFail(disputeId);
    if (this.isClosed(dispute.status)) {
      throw new BadRequestException('La disputa está cerrada');
    }
    const role = await this.assertAccess(dispute, user, 'SEND_MESSAGE');
    if (role === DisputeParticipantRole.SUPPORT) {
      throw new ForbiddenException('Solo comprador o vendedor pueden escribir');
    }

    const message = await this.messageModel.create({
      disputeId: dispute._id,
      senderId: user.userId,
      senderRole: role,
      content: dto.content,
      evidences: dto.evidences ?? [],
    });

    const now = new Date();
    const update: any = {
      updatedAt: now,
    };
    if (role === DisputeParticipantRole.BUYER) {
      update.lastBuyerActivityAt = now;
      update.deadlineAt = this.buildDeadline();
      update.status =
        dispute.status === DisputeStatus.ABIERTA
          ? DisputeStatus.PENDIENTE
          : dispute.status;
    } else if (role === DisputeParticipantRole.SELLER) {
      update.lastSellerActivityAt = now;
      update.status =
        dispute.status === DisputeStatus.ABIERTA
          ? DisputeStatus.PENDIENTE
          : dispute.status;
    }

    await this.disputeModel.updateOne({ _id: dispute._id }, update).exec();

    this.domainEvents.emitDisputeMessageCreated(dispute, message);
    return message;
  }

  async addEvidence(disputeId: string, dto: CreateDisputeMessageDto, user: any) {
    if (!dto.evidences?.length) {
      throw new BadRequestException('Evidencias requeridas');
    }
    return this.sendMessage(disputeId, { ...dto, content: dto.content }, user);
  }

  async escalate(disputeId: string, user: any) {
    const dispute = await this.findByIdOrFail(disputeId);
    await this.assertAccess(dispute, user, 'ESCALATE');

    if (this.isClosed(dispute.status)) {
      throw new BadRequestException('La disputa ya está cerrada');
    }

    dispute.status = DisputeStatus.ESCALADA_A_SOPORTE;
    await dispute.save();
    return dispute;
  }

  async close(disputeId: string, user: any) {
    const dispute = await this.findByIdOrFail(disputeId);
    const role = await this.assertAccess(dispute, user, 'CLOSE');
    if (role !== DisputeParticipantRole.BUYER) {
      throw new ForbiddenException('Solo el comprador puede cerrar la disputa');
    }
    if (this.isClosed(dispute.status)) {
      throw new BadRequestException('La disputa ya está cerrada');
    }

    dispute.status = DisputeStatus.CANCELADA;
    dispute.closedAt = new Date();
    await dispute.save();
    this.domainEvents.emitDisputeClosed(dispute);
    return dispute;
  }

  async resolve(disputeId: string, dto: ResolveDisputeDto, user: any) {
    const dispute = await this.findByIdOrFail(disputeId);
    const role = await this.assertAccess(dispute, user, 'RESOLVE');
    if (role !== DisputeParticipantRole.BUYER) {
      throw new ForbiddenException(
        'Solo el comprador puede marcar como resuelta',
      );
    }
    if (this.isClosed(dispute.status)) {
      throw new BadRequestException('La disputa ya está cerrada');
    }

    dispute.status = dto.resolution;
    dispute.closedAt = new Date();
    await dispute.save();
    this.domainEvents.emitDisputeResolved(dispute);
    return dispute;
  }

  async markMessageRead(disputeId: string, messageId: string, user: any) {
    const dispute = await this.findByIdOrFail(disputeId);
    await this.assertAccess(dispute, user, 'READ_MESSAGE');

    const res = await this.messageModel
      .updateOne(
        { _id: messageId, disputeId: dispute._id },
        { $addToSet: { readBy: user.userId } },
      )
      .exec();

    if (res.matchedCount === 0) {
      throw new NotFoundException('Mensaje no encontrado en la disputa');
    }
  }

  @Cron('0 3 * * *')
  async autoResolveStaleDisputes() {
    const threshold = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const candidates = await this.disputeModel
      .find({
        status: { $in: [DisputeStatus.ABIERTA, DisputeStatus.PENDIENTE] },
      })
      .lean();

    for (const dispute of candidates) {
      const lastBuyer = dispute.lastBuyerActivityAt ?? dispute.createdAt;
      const lastSeller = dispute.lastSellerActivityAt;

      if (
        lastBuyer &&
        lastBuyer <= threshold &&
        (!lastSeller || lastSeller < lastBuyer)
      ) {
        const updated = await this.disputeModel.findByIdAndUpdate(
          dispute._id,
          {
            status: DisputeStatus.RESUELTA_A_FAVOR_COMPRADOR,
            closedAt: new Date(),
          },
          { new: true },
        );
        if (updated) {
          this.domainEvents.emitDisputeResolved(updated);
        }
        this.logger.log(
          `Disputa ${dispute._id.toString()} cerrada automáticamente`,
        );
      }
    }
  }

  private async findByIdOrFail(id: string) {
    const dispute = await this.disputeModel.findById(id);
    if (!dispute) {
      throw new NotFoundException('Disputa no encontrada');
    }
    return dispute;
  }

  private async assertAccess(
    dispute: DisputeDocument,
    user: any,
    action: string,
  ): Promise<DisputeParticipantRole> {
    const normalizedRole = this.normalizeRole(user?.role);
    const isBuyer = dispute.buyerId === user.userId;
    const isSeller = dispute.sellerId === user.userId;
    const isSupport =
      normalizedRole === DisputeParticipantRole.SUPPORT ||
      normalizedRole === DisputeParticipantRole.ADMIN;

    if (isBuyer) return DisputeParticipantRole.BUYER;
    if (isSeller) return DisputeParticipantRole.SELLER;
    if (isSupport) return DisputeParticipantRole.SUPPORT;

    await this.accessLogs.log(
      dispute._id as Types.ObjectId,
      user?.userId,
      action,
    );
    throw new ForbiddenException('No tiene acceso a esta disputa');
  }

  private normalizeRole(role?: string): DisputeParticipantRole | 'unknown' {
    const val = (role ?? '').toLowerCase();
    if (val === 'buyer' || val === 'comprador')
      return DisputeParticipantRole.BUYER;
    if (val === 'seller' || val === 'vendedor')
      return DisputeParticipantRole.SELLER;
    if (val === 'admin') return DisputeParticipantRole.ADMIN;
    if (val === 'support' || val === 'soporte')
      return DisputeParticipantRole.SUPPORT;
    return 'unknown';
  }

  private ensureBuyer(role?: string) {
    const normalized = this.normalizeRole(role);
    if (normalized !== DisputeParticipantRole.BUYER) {
      throw new ForbiddenException('Solo el comprador puede abrir disputas');
    }
  }

  private isClosed(status: DisputeStatus) {
    return [
      DisputeStatus.CANCELADA,
      DisputeStatus.RESUELTA_A_FAVOR_COMPRADOR,
      DisputeStatus.RESUELTA_A_FAVOR_VENDEDOR,
    ].includes(status);
  }

  private buildDeadline() {
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }
}
