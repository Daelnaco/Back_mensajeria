import { AttachmentsService } from './attachments.service';
export declare class AttachmentsController {
    private readonly svc;
    constructor(svc: AttachmentsService);
    upload(file: Express.Multer.File): Promise<import("./entities/attachment.entity").Attachment>;
}
