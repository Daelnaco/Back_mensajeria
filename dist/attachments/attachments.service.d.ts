import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
export declare class AttachmentsService {
    private readonly repo;
    constructor(repo: Repository<Attachment>);
    private antivirusScan;
    store(file: Express.Multer.File): Promise<Attachment>;
}
