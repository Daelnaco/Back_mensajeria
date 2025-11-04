import { DisputeEvent } from './dispute-event.entity';
export type DisputeStatus = 'ABIERTO' | 'EN_REVISION' | 'RESUELTO' | 'CERRADO';
export declare class Dispute {
    idDisputa: number;
    idPedido?: number;
    idPublicacion?: number;
    idComprador: number;
    idVendedor: number;
    motivo: string;
    descripcion?: string;
    estado: DisputeStatus;
    ipOrigen?: string;
    userAgent?: string;
    creadoEn: Date;
    actualizadoEn: Date;
    eventos: DisputeEvent[];
}
