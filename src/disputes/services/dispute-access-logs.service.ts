import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DisputeAccessLog,
  DisputeAccessLogDocument,
} from '../schemas/dispute-access-log.schema';

@Injectable()
export class DisputeAccessLogsService {
  constructor(
    @InjectModel(DisputeAccessLog.name)
    private readonly model: Model<DisputeAccessLogDocument>,
  ) {}

  async log(disputeId: Types.ObjectId, userId: string, attemptedAction: string) {
    await this.model.create({
      disputeId,
      userId,
      attemptedAction,
    });
  }
}
