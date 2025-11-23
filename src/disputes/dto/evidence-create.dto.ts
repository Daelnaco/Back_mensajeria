import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class EvidenceCreateDto {
  @IsString()
  publicId: string;

  // Permitimos cualquier URL (http/https/blob/data) proveniente del FE.
  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(1)
  @Max(20 * 1024 * 1024)
  sizeBytes: number;

  @IsOptional()
  @IsString()
  signature?: string;
}
