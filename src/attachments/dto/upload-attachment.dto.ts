import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class UploadAttachmentDto {
  @ApiProperty({ example: 123 })
  @IsInt() @Min(1)
  messageId: number;               // id del mensaje tipo 'image' ya creado

  @ApiProperty({ example: 'image/png' })
  @IsString()
  mime: string;

  @ApiProperty({ example: 245678 })
  @IsInt() @Min(1)
  sizeBytes: number;

  @ApiProperty({ example: 'uploads/conv_10/msg_123/abc.png' })
  @IsString()
  storageKey: string;

  @ApiProperty({ example: 'https://secure.cdn/conv_10/msg_123/abc.png' })
  @IsString()
  urlSecure: string;

  @ApiProperty({ example: 'sha256:3a7bd3e2360a...' })
  @IsString()
  checksum: string;                 // hash calculado del archivo
}
