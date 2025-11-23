import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DisputeStatus } from '../enums/dispute-status.enum';
import { DisputeParticipantRole } from '../enums/participant-role.enum';

export class ListDisputesQueryDto {
  @IsOptional()
  @IsEnum(DisputeParticipantRole)
  role?: DisputeParticipantRole;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  parsedStatuses(): DisputeStatus[] | undefined {
    if (!this.status) return undefined;
    return this.status
      .split(',')
      .map((s) => s.trim())
      .filter((s) => (Object.values(DisputeStatus) as string[]).includes(s)) as
      | DisputeStatus[]
      | undefined;
  }
}
