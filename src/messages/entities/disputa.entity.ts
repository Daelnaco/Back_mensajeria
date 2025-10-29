import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('disputa')
export class Disputa {
  @PrimaryGeneratedColumn({ name: 'id_disputa' })
  idDisputa: number;

  @Column({ name: 'id_comprador' }) idComprador: number;
  @Column({ name: 'id_vendedor' }) idVendedor: number;
  @Column({ name: 'id_pedido' })   idPedido: number;

  @Column({ type: 'text', name: 'motivo' })
  motivo: string;

  @Column({ name: 'estado_reclamo' })
  estadoReclamo: string;

  @Column({ type: 'date', name: 'fecha_reclamo' })
  fechaReclamo: string;
}
