import { Injectable, ForbiddenException, ConflictException, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dispute, DisputeDocument } from './schemas/dispute.schema';
import { DisputeEvent, DisputeEventDocument } from './schemas/dispute-event.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';

// PLACEHOLDERS de integración externa
async function fetchOwnerInfoFromOrderService(orderId: string) {
  // Aquí debe hablar con el servicio de Órdenes / Carrito (otro squad)
  return {
    buyerId: 'USER123',
    sellerId: 'USER456',
  };
}

@Injectable()
export class DisputesService {
  constructor(
    @InjectModel(Dispute.name)
    private readonly disputeModel: Model<DisputeDocument>,
    @InjectModel(DisputeEvent.name)
    private readonly disputeEventModel: Model<DisputeEventDocument>,
  ) {}

  // === HU-01: crear disputa ===
  async openDispute(dto: CreateDisputeDto, user: any, ip: string, userAgent: string) {
    // 1. Validar pertenencia (comprador o vendedor)
    if (dto.orderId) {
      const orderInfo = await fetchOwnerInfoFromOrderService(dto.orderId);
      const isBuyer = orderInfo.buyerId === user.id;
      const isSeller = orderInfo.sellerId === user.id;
      if (!isBuyer && !isSeller) {
        throw new ForbiddenException('No puedes abrir disputa sobre una orden que no es tuya');
      }
    }

    // 2. Evitar duplicado "abierto"
    const existing = await this.disputeModel.findOne({
      ...(dto.orderId ? { orderId: dto.orderId } : {}),
      status: 'ABIERTO',
    });
    if (existing) {
      throw new ConflictException('Ya existe una disputa abierta para esta orden');
    }

    const now = new Date();

    // 3. Crear la disputa
    const dispute = await this.disputeModel.create({
      orderId: dto.orderId ?? null,
      reason: dto.reason,
      description: dto.description,
      attachments: dto.attachments ?? [],
      status: 'ABIERTO',
      createdByUserId: user.id,
      createdByIp: ip,
      createdByUserAgent: userAgent,
      lastActivityAt: now,
    });

    // 4. Registrar evento CREATED en historial
    await this.disputeEventModel.create({
      disputeId: dispute._id.toString(),
      eventType: 'CREATED',
      actorUserId: user.id,
      message: dto.description,
      attachments: dto.attachments ?? [],
    });

    return dispute;
  }

  // Para que el front liste mis disputas
  async findAllByUser(userId: string) {
    return this.disputeModel
      .find({ createdByUserId: userId })
      .sort({ createdAt: -1 });
  }

  // === HU-02: responder disputa ===
  async replyToDispute(disputeId: string, dto: ReplyDisputeDto, user: any) {
    const dispute = await this.disputeModel.findById(disputeId);
    if (!dispute) {
      throw new NotFoundException('Disputa no encontrada');
    }

    // Solo actores válidos (comprador/vendedor/admin)
    // Nota: Aquí deberías usar info real de la orden. Por ahora asumimos el mismo mock.
    const orderInfo = dispute.orderId
      ? await fetchOwnerInfoFromOrderService(dispute.orderId)
      : null;

    const isBuyer = orderInfo ? orderInfo.buyerId === user.id : false;
    const isSeller = orderInfo ? orderInfo.sellerId === user.id : false;
    const isAdmin = user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      throw new ForbiddenException('No puedes responder esta disputa');
    }

    // La disputa debe estar abierta o en revisión
    if (dispute.status !== 'ABIERTO' && dispute.status !== 'EN_REVISION') {
      throw new BadRequestException('La disputa no acepta más respuestas');
    }

    // Guardar evento REPLIED en historial
    await this.disputeEventModel.create({
      disputeId: dispute._id.toString(),
      eventType: 'REPLIED',
      actorUserId: user.id,
      message: dto.message ?? '',
      attachments: dto.attachments ?? [],
    });

    // Actualizar lastActivityAt
    dispute.lastActivityAt = new Date();
    await dispute.save();

    return { ok: true };
  }
}
