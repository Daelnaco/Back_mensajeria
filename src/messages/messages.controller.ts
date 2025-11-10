import {Controller} from '@nestjs/common';
import {Get} from '@nestjs/common';
import {Patch} from '@nestjs/common';
import {Param} from '@nestjs/common';
import {Req} from '@nestjs/common';
import {UseGuards} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Solo admin puede ver los mensajes marcados
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('flagged')
  getFlaggedMessages() {
    return this.messagesService.findFlagged();
  }

  // Soft delete de mensaje (dueño o admin)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/delete')
  async softDelete(@Param('id') id: string, @Req() req) {
    return this.messagesService.softDelete(id, req.user);
  }

  // Mensajes por orden
  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  getByOrder(@Param('orderId') orderId: string) {
    return this.messagesService.findByOrder(orderId);
  }

  // Mensajes por post
  @UseGuards(JwtAuthGuard)
  @Get('post/:postId')
  getByPost(@Param('postId') postId: string) {
    return this.messagesService.findByPost(postId);
  }
}

