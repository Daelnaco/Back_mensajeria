import { Injectable, BadRequestException, ForbiddenException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attachment, AttachmentDocument, } from './schemas/attachment.schema';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<AttachmentDocument>,
  ) {}

  // Validar MIME permitido
  private validateMime(mime: string) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(mime)) {
      throw new BadRequestException(
        'Formato no permitido. Solo imágenes (jpeg, png, webp)',
      );
    }
  }

  // Validar tamaño
  private validateSize(size: number) {
    const MAX = 5 * 1024 * 1024; // 5 MB
    if (size > MAX) {
      throw new BadRequestException(
        'Archivo demasiado grande (máx 5MB).',
      );
    }
  }

  // "Escaneo anti-malware" simulado
  private async fakeScan() {
    return true;
  }

  async handleUpload(file: Express.Multer.File, user: any) {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }

    // seguridad básica: puedes bloquear según rol
    if (!user || !user.id) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Validaciones
    this.validateMime(file.mimetype);
    this.validateSize(file.size);
    await this.fakeScan();

    // Guardamos metadatos en BD
    const created = await this.attachmentModel.create({
      ownerUserId: user.id,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    });

    // Devolvemos la info para que el front pueda asociarla al mensaje
    return {
      id: created._id.toString(),
      url: created.url,
      mimeType: created.mimeType,
      size: created.size,
      ownerUserId: created.ownerUserId,
      createdAt: created.createdAt,
    };
  }
}
