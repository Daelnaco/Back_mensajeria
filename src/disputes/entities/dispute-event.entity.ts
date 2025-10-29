import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Dispute } from './dispute.entity';

@Entity('dispute_events')
export class DisputeEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dispute, (d) => d.eventos, { onDelete: 'CASCADE' })
  disputa: Dispute;

  @Column({ type: 'int', name: 'actor_id' })
  actorId: number; // comprador/vendedor/admin

  @Column({ type: 'varchar', length: 30, name: 'actor_rol', nullable: true })
  actorRol?: string;

  @Column({ type: 'varchar', length: 30 })
  tipo: string; // CREATED | REPLIED | STATUS_CHANGED | ATTACH_ADDED

  @Column({ type: 'text', nullable: true })
  payload?: string; // JSON string (adjuntos, cambios, etc.)

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
