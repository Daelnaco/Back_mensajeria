import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputeEvent } from './entities/dispute-event.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
  
  @Injectable()
  export class DisputesService {
    constructor(
      @InjectRepository(Dispute)
      private readonly disputes: Repository<Dispute>,
      @InjectRepository(DisputeEvent)
      private readonly events: Repository<DisputeEvent>,
    ) {}
  
    // TODO: reemplazar por llamados reales a microservicios de Órdenes/Publicaciones
    private async validateOwnershipOrThrow(userId: number, dto: CreateDisputeDto) {
      const esDueñoPedido = !!dto.orderId; // ← validar vía HTTP a Órdenes
      const esDueñoPublicacion = !!dto.postId; // ← validar vía HTTP a Publicaciones
      if (!esDueñoPedido && !esDueñoPublicacion) {
        throw new ForbiddenException('El recurso no pertenece al usuario');
      }
      // Retorna ids reales cuando integres ms de órdenes/publicaciones
      return { idComprador: userId, idVendedor: 999 };
    }
  
    private async ensureNotDuplicateOpen(dto: CreateDisputeDto, _idComprador: number) {
      const dup = await this.disputes.findOne({
        where: [
          dto.orderId
            ? { idPedido: dto.orderId, estado: 'ABIERTO' as const }
            : { idPedido: Not(0) }, // evita filtrar por idPedido si no viene
          dto.postId
            ? { idPublicacion: dto.postId, estado: 'ABIERTO' as const }
            : { idPublicacion: Not(0) },
        ],
      });
      if (dup) {
        throw new BadRequestException(
          'Ya existe una disputa abierta para este recurso',
        );
      }
    }
  
    async create(dto: CreateDisputeDto, user: any, ip?: string, ua?: string) {
      const { idComprador, idVendedor } = await this.validateOwnershipOrThrow(
        Number(user.id),
        dto,
      );
      await this.ensureNotDuplicateOpen(dto, idComprador);
  
      const entity = this.disputes.create({
        idPedido: dto.orderId,
        idPublicacion: dto.postId,
        idComprador,
        idVendedor,
        motivo: dto.motivo,
        descripcion: dto.descripcion,
        estado: 'ABIERTO',
        ipOrigen: ip,
        userAgent: ua,
      });
      const saved = await this.disputes.save(entity);
  
      const evt = this.events.create({
        disputa: saved,
        actorId: Number(user.id),
        actorRol: user.role,
        tipo: 'CREATED',
        payload: dto.adjuntos
          ? JSON.stringify({ adjuntos: dto.adjuntos })
          : undefined,
      });
      await this.events.save(evt);
  
      return saved;
    }
  
    /** ====== HU-02: responder disputa ====== */
  
    private async assertCanReplyOrThrow(d: Dispute | null, user: any) {
      if (!d) throw new NotFoundException('Disputa no encontrada');
  
      // Solo estados que admiten respuesta
      if (!['ABIERTO', 'EN_REVISION'].includes(d.estado)) {
        throw new BadRequestException(
          'La disputa no admite respuestas en este estado',
        );
      }
  
      // Actor debe pertenecer a la disputa (comprador/vendedor) o ser admin
      const uid = Number(user.id);
      const isMember = [d.idComprador, d.idVendedor].includes(uid);
      const isAdmin = user?.role === 'admin';
      if (!isMember && !isAdmin) {
        throw new ForbiddenException('No perteneces a esta disputa');
      }
    }
  
    async reply(disputeId: number, dto: ReplyDisputeDto, user: any) {
      const d = await this.disputes.findOne({
        where: { idDisputa: disputeId },
      });
  
      await this.assertCanReplyOrThrow(d, user);
  
      // Registrar evento de respuesta (historial)
      const evt = this.events.create({
        disputa: d!, // existe por el guard anterior
        actorId: Number(user.id),
        actorRol: user.role,
        tipo: 'REPLIED',
        payload: JSON.stringify({
          mensaje: dto.mensaje,
          adjuntos: dto.adjuntos ?? [],
        }),
      });
      await this.events.save(evt);
  
      // "Última actividad": UpdateDateColumn de la disputa
      await this.disputes.update(
        { idDisputa: disputeId },
        { actualizadoEn: new Date() },
      );
  
      return { ok: true };
    }
  }
  