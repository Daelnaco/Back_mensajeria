import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString, MinLength } from 'class-validator';

export class CreateDisputeDto {
  @ApiPropertyOptional({
    description: 'Conversación asociada (opcional)',
    type: Number,
    minimum: 1,
    example: 123,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  conversation_id?: number;

  @ApiPropertyOptional({
    description: 'Orden asociada (opcional)',
    type: Number,
    minimum: 1,
    example: 456,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order_id?: number;

  @ApiProperty({
    description: 'Motivo de la disputa',
    example: 'Producto dañado',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  reason!: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del problema',
    example: 'Pantalla rota y empaque abollado; solicito reemplazo.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
