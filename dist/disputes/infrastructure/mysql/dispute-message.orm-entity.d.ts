import { DisputeOrmEntity } from './dispute.orm-entity';
export declare class DisputeMessageOrmEntity {
    id: string;
    disputeId: string;
    senderId: string;
    message: string;
    attachments: string[];
    createdAt: Date;
    dispute: DisputeOrmEntity;
}
