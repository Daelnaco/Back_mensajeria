import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EvidenceCreateDto } from './evidence-create.dto';

export class CreateDisputeMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceCreateDto)
  evidences?: EvidenceCreateDto[];
}
