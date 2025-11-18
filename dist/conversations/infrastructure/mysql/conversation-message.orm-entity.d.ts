import { ConversationMessageType, ConversationParticipantRole } from '../../entities/conversation.entity';
export declare class ConversationMessageOrmEntity {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: ConversationParticipantRole;
    type: ConversationMessageType;
    body?: string | null;
    editedAt?: Date | null;
    deletedAt?: Date | null;
    createdAt: Date;
}
