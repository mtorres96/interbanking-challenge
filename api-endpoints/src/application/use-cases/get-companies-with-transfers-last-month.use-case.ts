import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { TransferRepository } from '../../domain/repositories/transfer.repository';

@Injectable()
export class GetCompaniesWithTransfersLastMonthUseCase {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly transferRepo: TransferRepository,
  ) {}

  async execute(): Promise<
    Array<{
      amount: number;
      companyId: string;
      debitAccount: string;
      creditAccount: string;
    }>
  > {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const transfers = await this.transferRepo.findByDateRange(
      startOfLastMonth,
      endOfLastMonth,
    );

    return transfers.map((t) => ({
      amount: t.amount,
      companyId: t.companyId,
      debitAccount: t.debitAccount,
      creditAccount: t.creditAccount,
    }));
  }
}
