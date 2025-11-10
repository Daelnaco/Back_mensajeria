import { IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDisputeDto {
  @IsOptional()
  @IsInt()
  orderId?: number;

  @IsOptional()
  @IsInt()
  postId?: number;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  motivo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  // ejemplo: ["fileKey1","fileKey2"] si usas prefirmadas
  @IsOptional()
  adjuntos?: string[];
}
