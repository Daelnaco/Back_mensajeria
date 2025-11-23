import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

// Reutilizamos para acciones sencillas (flag, edit opcional a futuro)
export class UpdateMessageDto {
  @ApiPropertyOptional({ example: 'lenguaje inapropiado' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  reason?: string;
}
