import { Controller, Post, UploadedFile, UseInterceptors, Req, UseGuards, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AttachmentsService } from './attachments.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiBadRequestResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';

@ApiTags('Adjuntos (HU-04)')
@ApiBearerAuth()
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // carpeta local (asegúrate que exista)
        filename: (req, file, cb) => {
          // generar nombre único
          const ext =
            file.originalname.split('.').pop() || 'bin';
          const unique = randomUUID();
          cb(null, `${unique}.${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({
    summary: 'Subir adjunto (imagen) para el chat',
    description:
      'Sube una imagen, valida MIME/tamaño, realiza un "escaneo" simulado, y guarda metadatos en BD.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Imagen a adjuntar (jpeg/png/webp)',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Archivo subido y registrado',
  })
  @ApiBadRequestResponse({
    description:
      'Archivo inválido (tipo no permitido, tamaño excedido, sin archivo, etc.)',
  })
  @ApiForbiddenResponse({
    description: 'El usuario no está autorizado a subir archivos',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.attachmentsService.handleUpload(file, req.user);
  }
}
