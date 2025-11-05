import { AttachmentsService } from './attachments.service';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
export declare class AttachmentsController {
    private readonly svc;
    constructor(svc: AttachmentsService);
    upload(dto: UploadAttachmentDto, req: any): Promise<{
        ok: boolean;
    }>;
    getUrl(id: string): Promise<any>;
    setStatus(id: string, status: 'clean' | 'infected'): Promise<{
        ok: boolean;
    }>;
}
