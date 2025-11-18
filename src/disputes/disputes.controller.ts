import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeFiltersDto } from './dto/dispute-filters.dto';
import { DisputesService } from './disputes.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @Roles(Role.BUYER)
  createDispute(
    @CurrentUser() user: { userId: string },
    @Body() payload: CreateDisputeDto,
  ) {
    return this.disputesService.createDispute(user.userId, payload);
  }

  @Get('my')
  @Roles(Role.BUYER)
  getBuyerDisputes(
    @CurrentUser() user: { userId: string },
    @Query() filters: DisputeFiltersDto,
  ) {
    return this.disputesService.getBuyerDisputes(user.userId, filters);
  }

  @Get('seller')
  @Roles(Role.SELLER)
  getSellerDisputes(
    @CurrentUser() user: { userId: string },
    @Query() filters: DisputeFiltersDto,
  ) {
    return this.disputesService.getSellerDisputes(user.userId, filters);
  }

  @Get(':id')
  @Roles(Role.BUYER, Role.SELLER)
  getDisputeById(@Param('id', ParseIntPipe) id: number) {
    return this.disputesService.findById(String(id));
  }
}
