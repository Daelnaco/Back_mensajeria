import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ConversationMessage } from '../../conversations/entities/message.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConversationMessage, { onDelete: 'CASCADE', nullable: true })
  message?: ConversationMessage;

  @Column({ type: 'varchar', length: 500 })
  storagePath: string;

  @Column({ type: 'varchar', length: 200 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailPath?: string;

  @CreateDateColumn()
  createdAt: Date;
}
