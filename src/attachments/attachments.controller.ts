import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AttachmentsService } from './attachments.service';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';

@ApiTags('Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly svc: AttachmentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Registrar metadata de adjunto (queda en pending)' })
  upload(@Body() dto: UploadAttachmentDto, @Req() req) {
    return this.svc.upload(dto, req.user.id);
  }

  @Get(':id/url')
  @ApiOperation({ summary: 'Obtener URL segura si el adjunto está limpio' })
  @ApiParam({ name: 'id', type: Number })
  getUrl(@Param('id') id: string) {
    return this.svc.secureUrl(+id);
  }

  // Solo para DEV/QA si no tienes pipeline antivirus aún
  @Post(':id/antivirus/:status')
  @ApiOperation({ summary: 'Forzar estado antivirus (clean|infected) [DEV]' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'status', enum: ['clean','infected'] })
  setStatus(@Param('id') id: string, @Param('status') status: 'clean'|'infected') {
    return this.svc.setAntivirusStatus(+id, status);
  }
}
