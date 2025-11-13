import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly svc: ConversationsService) {}

  @Post()
  async createConversation(@Body() dto: CreateConversationDto, @Req() req: any) {
    const buyerId = Number(req.user.sub || req.user.id);
    return this.svc.createConversation(buyerId, dto.sellerId, dto.idPedido, dto.idPublicacion);
  }

  @Post(':id/messages')
  postMessage(@Param('id') id: string, @Body() dto: CreateConversationMessageDto, @Req() req: any) {
    const userId = Number(req.user.sub || req.user.id);
    return this.svc.postMessage(Number(id), dto, { id: userId });
  }

  @Get(':id/messages')
  list(
    @Param('id') id: string,
    @Req() req: any,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = Number(req.user.sub || req.user.id);
    return this.svc.listMessages(Number(id), { id: userId }, cursor, limit ? Number(limit) : undefined);
  }
}

