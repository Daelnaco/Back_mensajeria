import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisputeReason } from '../../entities/dispute-reason.enum';
import { DisputeStatus } from '../../entities/dispute-status.enum';

@Entity('dispute')
export class DisputeOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'conversation_id', type: 'bigint', unsigned: true, nullable: true })
  conversationId?: string | null;

  @Column({ name: 'order_id', type: 'int', unsigned: true, nullable: true })
  orderId?: number | null;

  @Column({ name: 'opener_id', type: 'bigint', unsigned: true })
  openerId!: string;

  @Column({
    type: 'enum',
    enum: DisputeReason,
  })
  reason!: DisputeReason;

  @Column({ name: 'descripcion', type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.OPEN,
  })
  status!: DisputeStatus;

  @CreateDateColumn({ name: 'opened_at', type: 'datetime', precision: 3 })
  openedAt!: Date;

  @Column({ name: 'closed_at', type: 'datetime', precision: 3, nullable: true })
  closedAt?: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'datetime', precision: 3, nullable: true })
  deletedAt?: Date | null;
}
