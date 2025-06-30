import { Injectable } from '@nestjs/common';
import { TransferRepository } from 'src/domain/repositories/transfer.repository';
import { Transfer } from 'src/domain/entities/transfer.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InMemoryTransferRepository implements TransferRepository {
  private transfers: Transfer[] = [];

  constructor() {
    const dataPath = path.resolve(__dirname, '../../../data/transfers.mock.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(raw);
      this.transfers = parsed.map((t: any) =>
        new Transfer(t.companyId, t.amount, t.debitAccount, t.creditAccount, new Date(t.date))
      );
    }
  }

  async save(transfer: Transfer): Promise<void> {
    this.transfers.push(transfer);
  }

  async findAll(): Promise<Transfer[]> {
    return this.transfers;
  }

  async findByCompanyId(companyId: string): Promise<Transfer[]> {
    return this.transfers.filter(t => t.companyId === companyId);
  }

  async findByDateRange(start: Date, end: Date): Promise<Transfer[]> {
    return this.transfers.filter(t =>
      t.date >= start && t.date <= end
    );
  }
}