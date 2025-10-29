import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { DisputeEvent, DisputeEventSchema } from './schemas/dispute-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: DisputeEvent.name, schema: DisputeEventSchema },
    ]),
  ],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
