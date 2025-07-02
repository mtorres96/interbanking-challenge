import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transfer')
export class TypeOrmTransferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: string;

  @Column('decimal')
  amount: number;

  @Column()
  debitAccount: string;

  @Column()
  creditAccount: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}