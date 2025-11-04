import { Model } from 'mongoose';
import { AttachmentDocument } from './schemas/attachment.schema';
export declare class AttachmentsService {
    private readonly attachmentModel;
    constructor(attachmentModel: Model<AttachmentDocument>);
    private validateMime;
    private validateSize;
    private fakeScan;
    handleUpload(file: Express.Multer.File, user: any): Promise<{
        id: string;
        url: string;
        mimeType: string;
        size: number;
        ownerUserId: string;
        createdAt: Date;
    }>;
}
