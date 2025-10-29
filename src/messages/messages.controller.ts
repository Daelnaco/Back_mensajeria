import { Controller, Post, Get, Param, Body, Query, Req, UseGuards, } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse, ApiQuery, } from '@nestjs/swagger';

@ApiTags('Mensajes (HU-03)')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // HU-03 (parte envío): enviar mensaje asociado a una orden
  @Post('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Enviar mensaje en el chat de una orden',
    description:
      'Crea un mensaje (texto o imagen) asociado a una orden específica. ' +
      'Valida que el usuario pueda hablar de esa orden y deja estado "sent".',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({ description: 'Mensaje enviado' })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permiso sobre esta orden',
  })
  async sendMessage(
    @Param('orderId') orderId: string,
    @Body() body: Omit<CreateMessageDto, 'orderId'>,
    @Req() req: any,
  ) {
    // armamos el dto final agregando orderId de la URL
    const dto: CreateMessageDto = {
      ...body,
      orderId,
    };
    return this.messagesService.sendMessage(dto, req.user);
  }

  // HU-03 (parte lectura): listar mensajes de la orden con paginación
  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener mensajes de la orden (chat)',
    description:
      'Devuelve mensajes cronológicos (ASC) de la orden dada. ' +
      'Soporta paginación por cursor (fecha) y límite de resultados.',
  })
  @ApiOkResponse({ description: 'Mensajes obtenidos' })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permiso sobre esta orden',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'ISO date. Entrega solo mensajes creados DESPUÉS de esa fecha.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad máxima de mensajes. Default 20.',
  })
  async getMessages(
    @Param('orderId') orderId: string,
    @Query() query: GetMessagesQueryDto,
    @Req() req: any,
  ) {
    return this.messagesService.getMessagesForOrder(orderId, query, req.user);
  }
}
