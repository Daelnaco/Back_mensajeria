import { Dispute } from './dispute.entity';
export declare class DisputeEvent {
    id: number;
    disputa: Dispute;
    actorId: number;
    actorRol?: string;
    tipo: string;
    payload?: string;
    creadoEn: Date;
}
