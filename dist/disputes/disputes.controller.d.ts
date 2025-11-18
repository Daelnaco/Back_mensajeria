import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeFiltersDto } from './dto/dispute-filters.dto';
import { DisputesService } from './disputes.service';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    createDispute(user: {
        userId: string;
    }, payload: CreateDisputeDto): Promise<import("./entities/dispute.entity").Dispute>;
    getBuyerDisputes(user: {
        userId: string;
    }, filters: DisputeFiltersDto): Promise<import("../common/interfaces/pagination-result.interface").PaginationResult<import("./entities/dispute.entity").Dispute>>;
    getSellerDisputes(user: {
        userId: string;
    }, filters: DisputeFiltersDto): Promise<import("../common/interfaces/pagination-result.interface").PaginationResult<import("./entities/dispute.entity").Dispute>>;
    getDisputeById(id: number): Promise<import("./entities/dispute.entity").Dispute>;
}
