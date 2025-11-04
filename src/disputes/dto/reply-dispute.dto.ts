import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class ReplyDisputeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  mensaje: string;

  @IsOptional()
  adjuntos?: string[];
}
