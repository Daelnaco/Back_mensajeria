import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conversation')
export class ConversationOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ name: 'order_id', type: 'int', unsigned: true, nullable: true })
  orderId?: number | null;

  @Column({ name: 'buyer_id', type: 'bigint', unsigned: true })
  buyerId!: string;

  @Column({ name: 'seller_id', type: 'bigint', unsigned: true })
  sellerId!: string;

  @Column({
    name: 'last_activity_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  lastActivityAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'datetime', precision: 3, nullable: true })
  deletedAt?: Date | null;
}
