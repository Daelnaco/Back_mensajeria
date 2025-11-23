import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { DisputeStatus } from '../enums/dispute-status.enum';

const allowedResolutions = [
  DisputeStatus.RESUELTA_A_FAVOR_COMPRADOR,
  DisputeStatus.RESUELTA_A_FAVOR_VENDEDOR,
] as const;

export class ResolveDisputeDto {
  @IsEnum(DisputeStatus)
  resolution: (typeof allowedResolutions)[number];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  comment?: string;
}
