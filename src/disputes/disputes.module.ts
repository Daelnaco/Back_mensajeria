import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import {
  DisputeMessage,
  DisputeMessageSchema,
} from './schemas/dispute-message.schema';
import {
  DisputeAccessLog,
  DisputeAccessLogSchema,
} from './schemas/dispute-access-log.schema';
import { OrdersService } from './orders.service';
import { DomainEventsService } from './domain-events.service';
import { DisputeAccessLogsService } from './services/dispute-access-logs.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: DisputeMessage.name, schema: DisputeMessageSchema },
      { name: DisputeAccessLog.name, schema: DisputeAccessLogSchema },
    ]),
  ],
  controllers: [DisputesController],
  providers: [
    DisputesService,
    OrdersService,
    DomainEventsService,
    DisputeAccessLogsService,
  ],
})
export class DisputesModule {}
