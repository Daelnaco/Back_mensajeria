import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
export declare class DisputesController {
    private readonly svc;
    constructor(svc: DisputesService);
    create(dto: CreateDisputeDto, ip: string, ua: string, req: any): Promise<import("./entities/dispute.entity").Dispute>;
    reply(id: string, dto: ReplyDisputeDto, req: any): Promise<{
        ok: boolean;
    }>;
}
