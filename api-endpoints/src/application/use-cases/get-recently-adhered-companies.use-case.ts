import { Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';


@Injectable()
export class GetRecentlyAdheredCompaniesUseCase {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async execute(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
  
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    return this.companyRepo.findAdheredSincePaginatedWithTotal(oneMonthAgo, offset, limit);
  }
}
