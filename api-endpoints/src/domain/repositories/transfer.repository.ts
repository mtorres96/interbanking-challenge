import { Transfer } from '../entities/transfer.entity';

export interface TransferRepository {
  save(transfer: Transfer): Promise<void>;
  findAll(): Promise<Transfer[]>;
  findByCompanyId(companyId: string): Promise<Transfer[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transfer[]>;
}
