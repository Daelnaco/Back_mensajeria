import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { DisputeStatus } from '../entities/dispute-status.enum';

export class DisputeFiltersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  status?: DisputeStatus;
}
