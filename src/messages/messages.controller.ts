import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}

  // HU3 — enviar
  @Post()
  @ApiOperation({ summary: 'Enviar mensaje' })
  @ApiParam({ name: 'conversationId', type: Number })
  @ApiResponse({ status: 201, description: 'Mensaje enviado' })
  send(
    @Param('conversationId') cid: string,
    @Req() req,
    @Body() dto: CreateMessageDto,
  ) {
    return this.svc.send(+cid, req.user.id, dto.role, dto.body);
  }

  // listar (timeline)
  @Get()
  @ApiOperation({ summary: 'Listar mensajes (paginación por cursor)' })
  @ApiParam({ name: 'conversationId', type: Number })
  @ApiQuery({ name: 'afterTs', required: false, description: 'ISO datetime' })
  @ApiQuery({ name: 'afterId', required: false, type: Number })
  list(
    @Param('conversationId') cid: string,
    @Query('afterTs') afterTs?: string,
    @Query('afterId') afterId?: string,
  ) {
    const after =
      afterTs && afterId ? { ts: afterTs, id: parseInt(afterId, 10) } : undefined;
    return this.svc.list(+cid, after);
  }

  // HU9 — eliminación lógica
  @Delete('/:messageId')
  @ApiOperation({ summary: 'Eliminación lógica de mensaje' })
  @ApiParam({ name: 'messageId', type: Number })
  remove(@Param('messageId') messageId: string, @Req() req) {
    return this.svc.softDelete(+messageId, req.user.id);
  }
}

// --- Endpoints de moderación global (HU8)
@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesModerationController {
  constructor(private readonly svc: MessagesService) {}

  @Post(':id/flag')
  @ApiOperation({ summary: 'Marcar mensaje para moderación' })
  @ApiParam({ name: 'id', type: Number })
  flag(@Param('id') id: string, @Req() req, @Body() dto: UpdateMessageDto) {
    return this.svc.flag(+id, dto.reason, req.user.id);
  }

  @Get('flagged')
  @ApiOperation({ summary: 'Listar mensajes marcados (moderación)' })
  flagged(@Query('limit') limit?: string) {
    return this.svc.listFlagged(limit ? parseInt(limit, 10) : 100);
  }
}
