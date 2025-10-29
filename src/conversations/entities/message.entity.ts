import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Conversation } from './conversation.entity';

export type MessageType = 'text' | 'image';
export type MessageStatus = 'sent' | 'delivered' | 'read';

@Entity('conversation_messages')
export class ConversationMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @Column({ type: 'int', name: 'sender_id' })
  senderId: number;

  @Column({ type: 'varchar', length: 10 })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageCaption?: string;

  @Column({ type: 'varchar', length: 12, default: 'sent' })
  status: MessageStatus;

  @CreateDateColumn({ name: 'creado_en' })
  @Index()
  creadoEn: Date;
}
