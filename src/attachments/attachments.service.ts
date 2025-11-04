import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Express } from 'express';
import { Attachment } from './entities/attachment.entity';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class AttachmentsService {
  constructor(@InjectRepository(Attachment) private readonly repo: Repository<Attachment>) {}

  private async antivirusScan(_absPath: string) {
    return true;
  }

  async store(file: Express.Multer.File) {
    if (!ALLOWED.includes(file.mimetype)) throw new BadRequestException('Formato no permitido');
    if (file.size > MAX_SIZE) throw new BadRequestException('Archivo excede tamaño máximo');

    const abs = path.resolve(file.path);
    const ok = await this.antivirusScan(abs);
    if (!ok) {
      fs.unlinkSync(abs);
      throw new BadRequestException('Fallo de escaneo/antimalware');
    }

    const saved = await this.repo.save(this.repo.create({
      storagePath: abs,
      mimeType: file.mimetype,
      size: file.size,
    }));
    return saved;
  }
}
