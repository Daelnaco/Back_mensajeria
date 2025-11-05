export declare class ReplyDisputeDto {
    eventType: 'message' | 'evidence' | 'agreement' | 'status_change';
    note?: string;
    payload?: any;
}
