import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMessagesQueryDto {
  @ApiPropertyOptional({
    description:
      'Cursor temporal (ISO date). Devuelve mensajes posteriores a este timestamp.',
    example: '2025-10-29T10:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Máximo de mensajes a devolver. Default 20.',
    example: '20',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
