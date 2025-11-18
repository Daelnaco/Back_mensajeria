import { DisputeOrmEntity } from './dispute.orm-entity';
export declare class DisputeEvidenceOrmEntity {
    id: string;
    disputeId: string;
    url: string;
    type: string;
    uploadedByUserId: string;
    createdAt: Date;
    dispute: DisputeOrmEntity;
}
