import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
export declare class DisputesController {
    private readonly svc;
    constructor(svc: DisputesService);
    open(req: any, dto: CreateDisputeDto): Promise<any>;
    reply(id: string, req: any, dto: ReplyDisputeDto): Promise<{
        ok: boolean;
        id: number;
        userId: number;
        eventType: string;
        note: string;
        payload: any;
    }>;
    close(id: string): Promise<{
        ok: boolean;
        id: number;
    }>;
    events(id: string): Promise<any[]>;
    get(id: string): Promise<any>;
    list(req: any, status?: 'open' | 'in_review' | 'agreement_pending' | 'closed' | 'rejected', scope?: 'mine' | 'all'): Promise<any>;
}
