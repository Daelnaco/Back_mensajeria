export interface PaginationResult<T> {
    data: T[];
    total: number;
    skip: number;
    limit: number;
}
