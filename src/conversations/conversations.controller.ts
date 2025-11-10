import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly svc: ConversationsService) {}

  @Post(':id/messages')
  postMessage(@Param('id') id: string, @Body() dto: CreateConversationMessageDto) {
    const user = (global as any).__req_user; // reemplaza por tu obtención de req.user
    return this.svc.postMessage(Number(id), dto, user);
    // estados 'delivered'/'read' se pueden actualizar en endpoints aparte
  }

  @Get(':id/messages')
  list(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const user = (global as any).__req_user;
    return this.svc.listMessages(Number(id), user, cursor, limit ? Number(limit) : undefined);
  }
}
