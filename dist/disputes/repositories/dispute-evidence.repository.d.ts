import { DisputeEvidence } from '../entities/dispute.entity';
export declare const DISPUTE_EVIDENCE_REPOSITORY: unique symbol;
export interface DisputeEvidenceRepository {
    createMany(payload: Array<Omit<DisputeEvidence, 'id' | 'createdAt'>>): Promise<DisputeEvidence[]>;
    findByDispute(disputeId: string): Promise<DisputeEvidence[]>;
}
