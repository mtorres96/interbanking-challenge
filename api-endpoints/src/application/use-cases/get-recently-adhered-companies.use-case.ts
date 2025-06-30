import { Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';


@Injectable()
export class GetRecentlyAdheredCompaniesUseCase {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async execute(): Promise<Company[]> {
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

    return this.companyRepo.findByAdhesionDateRange(
      startOfLastMonth,
      endOfLastMonth,
    );
  }
}
