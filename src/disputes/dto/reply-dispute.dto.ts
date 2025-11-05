import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class ReplyDisputeDto {
  @ApiProperty({ enum: ['message','evidence','agreement','status_change'] })
  @IsEnum(['message','evidence','agreement','status_change'] as any)
  eventType: 'message'|'evidence'|'agreement'|'status_change';

  @ApiPropertyOptional({ example: 'Adjunto comprobante' })
  @IsOptional() @IsString() @MinLength(3)
  note?: string;

  @ApiPropertyOptional({
    description: 'JSON con metadatos del evento',
    example: { url: 'https://bucket/archivo.png' }
  })
  @IsOptional()
  payload?: any;
}
