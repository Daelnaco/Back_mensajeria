import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputeEvent } from './entities/dispute-event.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ReplyDisputeDto } from './dto/reply-dispute.dto';
export declare class DisputesService {
    private readonly disputes;
    private readonly events;
    constructor(disputes: Repository<Dispute>, events: Repository<DisputeEvent>);
    private validateOwnershipOrThrow;
    private ensureNotDuplicateOpen;
    create(dto: CreateDisputeDto, user: any, ip?: string, ua?: string): Promise<Dispute>;
    private assertCanReplyOrThrow;
    reply(disputeId: number, dto: ReplyDisputeDto, user: any): Promise<{
        ok: boolean;
    }>;
}
