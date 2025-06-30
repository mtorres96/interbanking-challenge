import { Module } from '@nestjs/common';
import { CompanyController } from './infrastructure/controllers/companies.controller';

import { RegisterCompanyUseCase } from './application/use-cases/register-company.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from './application/use-cases/get-recently-adhered-companies.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from './application/use-cases/get-companies-with-transfers-last-month.use-case';

import { InMemoryCompanyRepository } from './infrastructure/persistence/in-memory-company.repository';
import { InMemoryTransferRepository } from './infrastructure/persistence/in-memory-transfer.repository';
import { HealthModule } from './infrastructure/health/health.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HealthModule, ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [CompanyController],
  providers: [
    InMemoryCompanyRepository,
    InMemoryTransferRepository,
    {
      provide: RegisterCompanyUseCase,
      useFactory: (companyRepo: InMemoryCompanyRepository) => {
        return new RegisterCompanyUseCase(companyRepo);
      },
      inject: [InMemoryCompanyRepository],
    },
    {
      provide: GetRecentlyAdheredCompaniesUseCase,
      useFactory: (companyRepo: InMemoryCompanyRepository) => {
        return new GetRecentlyAdheredCompaniesUseCase(companyRepo);
      },
      inject: [InMemoryCompanyRepository],
    },
    {
      provide: GetCompaniesWithTransfersLastMonthUseCase,
      useFactory: (
        companyRepo: InMemoryCompanyRepository,
        transferRepo: InMemoryTransferRepository,
      ) => {
        return new GetCompaniesWithTransfersLastMonthUseCase(
          companyRepo,
          transferRepo,
        );
      },
      inject: [InMemoryCompanyRepository, InMemoryTransferRepository],
    },
  ],
})
export class AppModule {}
