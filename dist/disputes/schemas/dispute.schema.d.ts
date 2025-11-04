import { Document } from 'mongoose';
export type DisputeDocument = Dispute & Document;
export declare class Dispute {
    orderId?: string;
    reason: string;
    description: string;
    attachments: string[];
    status: string;
    createdByUserId: string;
    createdByIp?: string;
    createdByUserAgent?: string;
    lastActivityAt: Date;
}
export declare const DisputeSchema: import("mongoose").Schema<Dispute, import("mongoose").Model<Dispute, any, any, any, Document<unknown, any, Dispute, any, {}> & Dispute & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dispute, Document<unknown, {}, import("mongoose").FlatRecord<Dispute>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Dispute> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
