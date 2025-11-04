import { Document, Types } from 'mongoose';
export type DisputeEventDocument = DisputeEvent & Document;
export declare class DisputeEvent {
    disputeId: string;
    eventType: string;
    actorUserId: string;
    message?: string;
    attachments: string[];
}
export declare const DisputeEventSchema: import("mongoose").Schema<DisputeEvent, import("mongoose").Model<DisputeEvent, any, any, any, Document<unknown, any, DisputeEvent, any, {}> & DisputeEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DisputeEvent, Document<unknown, {}, import("mongoose").FlatRecord<DisputeEvent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DisputeEvent> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
