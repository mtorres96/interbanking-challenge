import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { TransferRepository } from '../../domain/repositories/transfer.repository';

@Injectable()
export class GetCompaniesWithTransfersLastMonthUseCase {
  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly transferRepo: TransferRepository,
  ) {}

  async execute(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
  
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  
    return this.transferRepo.findByDateRangePaginatedWithTotal(start, end, offset, limit);
  }
}
