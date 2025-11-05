import { DataSource } from 'typeorm';
export declare class AttachmentsService {
    private readonly ds;
    constructor(ds: DataSource);
    upload(dto: {
        messageId: number;
        mime: string;
        sizeBytes: number;
        storageKey: string;
        urlSecure: string;
        checksum: string;
    }, actorId: number): Promise<{
        ok: boolean;
    }>;
    secureUrl(id: number): Promise<any>;
    setAntivirusStatus(id: number, status: 'clean' | 'infected'): Promise<{
        ok: boolean;
    }>;
}
