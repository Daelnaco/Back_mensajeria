import { Role } from '../../common/enums/role.enum';
export interface Conversation {
    id: string;
    buyerId: string;
    sellerId: string;
    orderId?: number | null;
    lastActivityAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
export type ConversationMessageType = 'text' | 'image';
export type ConversationParticipantRole = Role | 'moderator';
export interface ConversationMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: ConversationParticipantRole;
    type: ConversationMessageType;
    text?: string | null;
    attachments?: string[];
    createdAt: Date;
    editedAt?: Date | null;
    deletedAt?: Date | null;
}
