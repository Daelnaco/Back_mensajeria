import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { DisputeReason } from '../entities/dispute-reason.enum';

export class CreateDisputeDto {
  @IsNumber()
  @Min(1)
  orderId!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  conversationId?: number;

  @IsEnum(DisputeReason)
  reason!: DisputeReason;

  @IsOptional()
  @IsString()
  @Length(10, 255)
  description?: string;
}
