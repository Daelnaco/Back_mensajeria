import { Controller, Post, Get, Param, Body, Req, UseGuards, } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiCreatedResponse, ApiForbiddenResponse, ApiConflictResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, } from '@nestjs/swagger';

@ApiTags('Disputas (HU-01 HU-02)')
@ApiBearerAuth()
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  // HU-01
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear disputa',
    description:
      'Crea una disputa asociada a una orden/publicación. ' +
      'Valida que la orden pertenezca al usuario autenticado y que no haya otra disputa abierta. ' +
      'El campo `orderId` proviene del módulo de compras/carrito del Squad 5 (Carritos de compra). ' +
      'Sin esa integración final real, se está usando una validación simulada.',
     })
  @ApiBody({ type: CreateDisputeDto })
  @ApiCreatedResponse({ description: 'Disputa creada exitosamente' })
  @ApiConflictResponse({ description: 'Ya existe disputa abierta' })
  @ApiForbiddenResponse({ description: 'Orden no pertenece al usuario' })
  async openDispute(@Body() dto: CreateDisputeDto, @Req() req: any) {
    return this.disputesService.openDispute(
      dto,
      req.user,
      req.ip,
      req.headers['user-agent'] || '',
    );
  }

  // listado para el usuario autenticado
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar disputas propias',
    description: 'Devuelve las disputas creadas por el usuario autenticado.',
  })
  @ApiOkResponse({ description: 'Listado de disputas' })
  async myDisputes(@Req() req: any) {
    return this.disputesService.findAllByUser(req.user.id);
  }

  // HU-02
  @Post(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Responder disputa',
    description:
      'Agrega un mensaje/respuesta a una disputa existente (solo actores válidos o admin).',
  })
  @ApiBody({ type: ReplyDisputeDto })
  @ApiCreatedResponse({ description: 'Respuesta registrada' })
  @ApiForbiddenResponse({ description: 'No tienes permiso para responder esta disputa' })
  @ApiBadRequestResponse({ description: 'La disputa no acepta más respuestas' })
  @ApiNotFoundResponse({ description: 'Disputa no encontrada' })
  async reply(
    @Param('id') disputeId: string,
    @Body() dto: ReplyDisputeDto,
    @Req() req: any,
  ) {
    return this.disputesService.replyToDispute(disputeId, dto, req.user);
  }
}
