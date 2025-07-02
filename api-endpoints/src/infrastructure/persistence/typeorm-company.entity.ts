import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("company")
export class TypeOrmCompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cuit: string;

  @Column()
  businessName: string;

  @Column({ type: 'datetime' })
  joinedAt: Date;

  @Column()
  type: "PYME" | "CORPORATE";
}
