import { Document } from 'mongoose';
export type ConversationDocument = Conversation & Document;
export declare class Conversation {
    orderId: string;
    userAId: string;
    userBId: string;
    lastActivityAt: Date;
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation, any, {}> & Conversation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Conversation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
