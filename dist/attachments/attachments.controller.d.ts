import { AttachmentsService } from './attachments.service';
export declare class AttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    uploadFile(file: Express.Multer.File, req: any): Promise<{
        id: string;
        url: string;
        mimeType: string;
        size: number;
        ownerUserId: string;
        createdAt: Date;
    }>;
}
