import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { DisputeStatus } from '../entities/dispute-status.enum';
export declare class DisputeFiltersDto extends PaginationQueryDto {
    status?: DisputeStatus;
}
