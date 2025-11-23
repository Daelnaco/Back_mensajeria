import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DisputeReason } from '../enums/dispute-reason.enum';
import { EvidenceCreateDto } from './evidence-create.dto';

export class CreateDisputeDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  itemOrderId: string;

  @IsEnum(DisputeReason)
  reason: DisputeReason;

  @IsString()
  @Length(50, 2000)
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceCreateDto)
  evidences?: EvidenceCreateDto[];
}
