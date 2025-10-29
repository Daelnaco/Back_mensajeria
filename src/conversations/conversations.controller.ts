import { Controller, Post, Get, Param, Body, Req, UseGuards, } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationCreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiForbiddenResponse, ApiNotFoundResponse, } from '@nestjs/swagger';

@ApiTags('Conversaciones')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  /**
   * HU-03 (inicio de chat): crea/usa la conversación entre dos usuarios
   * sobre una orden y envía el primer mensaje.
   */
  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Iniciar conversación (o reutilizar) y enviar mensaje inicial',
    description:
      'Crea la conversación entre el usuario actual y otherUserId para una orden dada, ' +
      'o reutiliza la existente si ya existe, y guarda el mensaje.',
  })
  @ApiBody({ type: ConversationCreateMessageDto })
  @ApiCreatedResponse({ description: 'Mensaje enviado en la conversación' })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permiso para iniciar conversación',
  })
  async startConversationAndSend(
    @Body() dto: ConversationCreateMessageDto,
    @Req() req: any,
  ) {
    return this.conversationsService.sendMessageInConversation(
      dto,
      req.user,
    );
  }

  /**
   * Listar todas mis conversaciones (tipo "lista de chats recientes").
   */
  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar mis conversaciones',
    description:
      'Devuelve las conversaciones en las que participa el usuario autenticado, ' +
      'ordenadas por última actividad.',
  })
  @ApiOkResponse({ description: 'Conversaciones obtenidas' })
  async myConversations(@Req() req: any) {
    return this.conversationsService.listMyConversations(req.user.id);
  }

  /**
   * Obtener la conversación específica por orderId.
   */
  @Get('by-order/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener conversación por orderId',
    description:
      'Devuelve la conversación asociada a esa orden si el usuario participa.',
  })
  @ApiOkResponse({ description: 'Conversación encontrada' })
  @ApiNotFoundResponse({ description: 'No existe conversación para esta orden' })
  async getByOrder(@Param('orderId') orderId: string, @Req() req: any) {
    return this.conversationsService.getConversationByOrder(
      orderId,
      req.user.id,
    );
  }
}
