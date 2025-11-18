import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  ConversationMessageType,
  ConversationParticipantRole,
} from '../../entities/conversation.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('message')
export class ConversationMessageOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'conversation_id', type: 'bigint', unsigned: true })
  conversationId!: string;

  @Column({ name: 'sender_id', type: 'bigint', unsigned: true })
  senderId!: string;

  @Column({
    name: 'sender_role',
    type: 'enum',
    enum: [Role.BUYER, Role.SELLER, 'moderator'],
  })
  senderRole!: ConversationParticipantRole;

  @Column({
    type: 'enum',
    enum: ['text', 'image'],
    default: 'text',
  })
  type!: ConversationMessageType;

  @Column({ name: 'body', type: 'text', nullable: true })
  body?: string | null;

  @Column({ name: 'edited_at', type: 'datetime', precision: 3, nullable: true })
  editedAt?: Date | null;

  @Column({ name: 'deleted_at', type: 'datetime', precision: 3, nullable: true })
  deletedAt?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;
}
