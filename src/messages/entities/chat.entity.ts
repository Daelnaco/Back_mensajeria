import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn({ name: 'id_chat' })
  idChat: number;

  @Column({ name: 'id_comprador', nullable: true }) idComprador?: number;
  @Column({ name: 'id_vendedor', nullable: true }) idVendedor?: number;
  @Column({ type: 'text', name: 'contenido' })
  contenido: string;
  @Column({ type: 'date', name: 'fecha_mensaje', nullable: true })
  fechaMensaje?: string;


  @Column({ type: 'int', name: 'sender_id', nullable: true })
  senderId?: number;

  @Column({ type: 'int', name: 'order_id', nullable: true })
  orderId?: number;

  @Column({ type: 'int', name: 'post_id', nullable: true })
  postId?: number;

  @Column({ type: 'tinyint', name: 'is_visible', default: () => '1' })
  isVisible: boolean;

  @Column({ type: 'tinyint', name: 'is_flagged', default: () => '0' })
  isFlagged: boolean;

  @Column({ type: 'tinyint', name: 'is_deleted', default: () => '0' })
  isDeleted: boolean;

  @Column({ type: 'datetime', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
