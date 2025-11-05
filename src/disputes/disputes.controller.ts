import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { UseGuards } from '@nestjs/common';

import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';

@ApiTags('Disputes')
// @UseGuards(JwtAuthGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly svc: DisputesService) {}

  /** HU1 — Abrir disputa (conversation_id y order_id son OPCIONALES) */
  @Post()
  @ApiOperation({ summary: 'Abrir disputa' })
  @ApiResponse({ status: 201, description: 'Disputa creada' })
  open(@Req() req, @Body() dto: CreateDisputeDto) {
    const openerId = req?.user?.id ?? 101; // id demo si no hay auth
    return this.svc.open(
      dto.conversation_id ?? null,
      openerId,
      dto.reason,
      dto.order_id ?? null,
      dto.description ?? null,
    );
  }

  /** HU2 — Responder disputa (evento) */
  @Post(':id/reply')
  @ApiOperation({ summary: 'Responder disputa (mensaje/evidencia/acuerdo)' })
  @ApiParam({ name: 'id', type: Number })
  reply(@Param('id') id: string, @Req() req, @Body() dto: ReplyDisputeDto) {
    const uid = req?.user?.id ?? 101; // demo
    return this.svc.reply(+id, uid, dto.eventType, dto.note, dto.payload);
  }

  /** Cierre (requiere 2 acuerdos de actores distintos; lo valida el trigger) */
  @Post(':id/close')
  @ApiOperation({ summary: 'Cerrar disputa (requiere 2 acuerdos distintos)' })
  @ApiParam({ name: 'id', type: Number })
  close(@Param('id') id: string) {
    return this.svc.close(+id);
  }

  /** Timeline de eventos */
  @Get(':id/events')
  @ApiOperation({ summary: 'Timeline de eventos de la disputa' })
  @ApiParam({ name: 'id', type: Number })
  events(@Param('id') id: string) {
    return this.svc.events(+id);
  }

  /** Detalle */
  @Get(':id')
  @ApiOperation({ summary: 'Detalle de disputa' })
  @ApiParam({ name: 'id', type: Number })
  get(@Param('id') id: string) {
    return this.svc.findById(+id);
  }

  /** Listado */
  @Get()
  @ApiQuery({ name: 'status', required: false, enum: ['open','in_review','agreement_pending','closed','rejected'] })
  @ApiQuery({ name: 'scope', required: false, enum: ['mine','all'] })
  async list(
    @Req() req,
    @Query('status') status?: 'open'|'in_review'|'agreement_pending'|'closed'|'rejected',
    @Query('scope') scope: 'mine'|'all' = 'all' // por demo, default 'all'
  ) {
    // cuando AUTH_DISABLED=true, probablemente no haya req.user
    const uid = req.user?.id; // queda undefined si no hay auth
    return this.svc.list({ status, scope, uid });
}

}
