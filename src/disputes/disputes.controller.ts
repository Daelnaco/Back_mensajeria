import { Body, Controller, Headers, Ip, Post, UseGuards, Req, Param } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private readonly svc: DisputesService) {}

  @Post()
  create(
    @Body() dto: CreateDisputeDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
    @Req() req: any,
  ) {
    return this.svc.create(dto, req.user, ip, ua);
  }

  @Post(':id/reply')
  reply(
    @Param('id') id: string,
    @Body() dto: ReplyDisputeDto,
    @Req() req: any,
  ) {
    return this.svc.reply(Number(id), dto, req.user);
  }
}
