import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ListMessagesQueryDto } from './dto/list-messages-query.dto';
import { SendConversationMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @Roles(Role.BUYER, Role.SELLER)
  getOrCreate(
    @CurrentUser() user: { userId: string; role: Role },
    @Body() payload: CreateConversationDto,
  ) {
    return this.conversationsService.getOrCreateConversation(
      user.userId,
      user.role,
      payload,
    );
  }

  @Get()
  @Roles(Role.BUYER, Role.SELLER)
  list(
    @CurrentUser() user: { userId: string },
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.conversationsService.listUserConversations(
      user.userId,
      pagination,
    );
  }

  @Get(':id/messages')
  @Roles(Role.BUYER, Role.SELLER)
  listMessages(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Query() pagination: ListMessagesQueryDto,
  ) {
    return this.conversationsService.listMessages(id, user.userId, pagination);
  }

  @Post(':id/messages')
  @Roles(Role.BUYER, Role.SELLER)
  sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
    @Body() payload: SendConversationMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, user.userId, payload);
  }
}
