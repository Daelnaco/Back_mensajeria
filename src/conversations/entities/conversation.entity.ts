import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'id_pedido', nullable: true })
  idPedido?: number;

  @Column({ type: 'int', name: 'id_publicacion', nullable: true })
  idPublicacion?: number;

  @Column({ type: 'int', name: 'buyer_id' })
  buyerId: number;

  @Column({ type: 'int', name: 'seller_id' })
  sellerId: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}
