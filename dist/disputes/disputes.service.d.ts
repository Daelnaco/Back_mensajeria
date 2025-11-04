import { Model } from 'mongoose';
import { Dispute, DisputeDocument } from './schemas/dispute.schema';
import { DisputeEventDocument } from './schemas/dispute-event.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
export declare class DisputesService {
    private readonly disputeModel;
    private readonly disputeEventModel;
    constructor(disputeModel: Model<DisputeDocument>, disputeEventModel: Model<DisputeEventDocument>);
    openDispute(dto: CreateDisputeDto, user: any, ip: string, userAgent: string): Promise<import("mongoose").Document<unknown, {}, DisputeDocument, {}, {}> & Dispute & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, DisputeDocument, {}, {}> & Dispute & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    replyToDispute(disputeId: string, dto: ReplyDisputeDto, user: any): Promise<{
        ok: boolean;
    }>;
}
