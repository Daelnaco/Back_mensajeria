import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DisputeEvent } from './dispute-event.entity';

export type DisputeStatus = 'ABIERTO' | 'EN_REVISION' | 'RESUELTO' | 'CERRADO';

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn({ name: 'id_disputa' })
  idDisputa: number;

  @Column({ type: 'int', name: 'id_pedido', nullable: true })
  idPedido?: number;

  @Column({ type: 'int', name: 'id_publicacion', nullable: true })
  idPublicacion?: number;

  @Column({ type: 'int', name: 'id_comprador' })
  idComprador: number;

  @Column({ type: 'int', name: 'id_vendedor' })
  idVendedor: number;

  @Column({ type: 'varchar', length: 255, name: 'motivo' })
  motivo: string;

  @Column({ type: 'text', name: 'descripcion', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 20, name: 'estado', default: 'ABIERTO' })
  estado: DisputeStatus;

  @Column({ type: 'varchar', length: 45, name: 'ip_origen', nullable: true })
  ipOrigen?: string;

  @Column({ type: 'varchar', length: 255, name: 'user_agent', nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @OneToMany(() => DisputeEvent, (e) => e.disputa, { cascade: true })
  eventos: DisputeEvent[];
}
