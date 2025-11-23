import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ListDisputesQueryDto } from './dto/list-disputes.query';
import { CreateDisputeMessageDto } from './dto/create-dispute-message.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@UseGuards(JwtAuthGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(@Body() dto: CreateDisputeDto, @Req() req: any) {
    return this.disputesService.createDispute(dto, req.user);
  }

  @Get()
  findAll(@Query() query: ListDisputesQueryDto, @Req() req: any) {
    return this.disputesService.listDisputes(query, req.user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: any,
  ) {
    return this.disputesService.getDisputeDetail(id, req.user, { page, limit });
  }

  @Post(':id/messages')
  createMessage(
    @Param('id') id: string,
    @Body() dto: CreateDisputeMessageDto,
    @Req() req: any,
  ) {
    return this.disputesService.sendMessage(id, dto, req.user);
  }

  @Post(':id/evidence')
  uploadEvidence(
    @Param('id') id: string,
    @Body() dto: CreateDisputeMessageDto,
    @Req() req: any,
  ) {
    return this.disputesService.addEvidence(id, dto, req.user);
  }

  @Post(':id/escalate')
  escalate(@Param('id') id: string, @Req() req: any) {
    return this.disputesService.escalate(id, req.user);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Req() req: any) {
    return this.disputesService.close(id, req.user);
  }

  @Patch(':id/resolve')
  resolve(
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
    @Req() req: any,
  ) {
    return this.disputesService.resolve(id, dto, req.user);
  }

  @Patch(':id/messages/:messageId/read')
  markRead(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Req() req: any,
  ) {
    return this.disputesService.markMessageRead(id, messageId, req.user);
  }
}
