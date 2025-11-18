import { IsInt, IsOptional, IsString, MaxLength, MinLength, Min } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  otherUserId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  orderId?: number;
}
