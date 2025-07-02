import { Transfer } from "../entities/transfer.entity";

export abstract class TransferRepository {
  abstract save(transfer: Transfer): Promise<Transfer>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<Transfer[]>;
  abstract findByDateRangePaginatedWithTotal(
    start: Date,
    end: Date,
    offset: number,
    limit: number
  ): Promise<{ results: Transfer[]; total: number }>;

  
}
