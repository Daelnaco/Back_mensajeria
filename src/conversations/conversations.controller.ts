import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly svc: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva conversación (buyer-seller)' })
  create(@Req() req, @Body() dto: CreateConversationDto) {
    return this.svc.create(req.user.id, dto.sellerId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar conversaciones del usuario (inbox)' })
  list(@Req() req) {
    return this.svc.listByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener conversación por ID' })
  @ApiParam({ name: 'id', type: Number })
  find(@Param('id') id: string) {
    return this.svc.findById(+id);
  }
}
