import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ enum: ['buyer', 'seller', 'moderator'] })
  @IsEnum(['buyer', 'seller', 'moderator'] as any)
  role: 'buyer' | 'seller' | 'moderator';

  @ApiProperty({ example: 'Hola, ¿llegó el pedido?' })
  @IsString()
  @MinLength(1)
  body: string;
}
