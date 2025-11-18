import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('purchases')
export class PurchaseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36 })
  buyerId!: string;

  @Column({ type: 'char', length: 36 })
  sellerId!: string;

  @Column({ type: 'varchar', length: 50 })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
