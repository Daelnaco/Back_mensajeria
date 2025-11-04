import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    openDispute(dto: CreateDisputeDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/dispute.schema").DisputeDocument, {}, {}> & import("./schemas/dispute.schema").Dispute & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    myDisputes(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/dispute.schema").DisputeDocument, {}, {}> & import("./schemas/dispute.schema").Dispute & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    reply(disputeId: string, dto: ReplyDisputeDto, req: any): Promise<{
        ok: boolean;
    }>;
}
