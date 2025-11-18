import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../common/guards/roles.guard';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { DISPUTE_REPOSITORY } from './repositories/dispute.repository';
import { DisputeOrmEntity } from './infrastructure/mysql/dispute.orm-entity';
import { DisputeMysqlRepository } from './infrastructure/mysql/dispute.mysql.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DisputeOrmEntity,
    ]),
  ],
  controllers: [DisputesController],
  providers: [
    DisputesService,
    RolesGuard,
    {
      provide: DISPUTE_REPOSITORY,
      useClass: DisputeMysqlRepository,
    },
  ],
  exports: [DisputesService],
})
export class DisputesModule {}
