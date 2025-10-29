import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyDisputeDto {
  @ApiProperty({
    description: 'Mensaje de respuesta del usuario',
    example: 'Adjunto más evidencia del daño',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Adjuntos adicionales (URLs)',
    example: ['https://ruta/foto-extra.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
