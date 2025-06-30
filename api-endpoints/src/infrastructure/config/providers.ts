import { CompanyController } from '../controllers/companies.controller';

import { InMemoryCompanyRepository } from '../persistence/in-memory-company.repository';
import { InMemoryTransferRepository } from '../persistence/in-memory-transfer.repository';

import { RegisterCompanyUseCase } from 'src/application/use-cases/register-company.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from 'src/application/use-cases/get-recently-adhered-companies.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from 'src/application/use-cases/get-companies-with-transfers-last-month.use-case';

export function createCompanyController(): CompanyController {
  const companyRepo = new InMemoryCompanyRepository();
  const transferRepo = new InMemoryTransferRepository();

  const registerCompanyUseCase = new RegisterCompanyUseCase(companyRepo);
  const getRecentUseCase = new GetRecentlyAdheredCompaniesUseCase(companyRepo);
  const getWithTransfersUseCase = new GetCompaniesWithTransfersLastMonthUseCase(
    companyRepo,
    transferRepo,
  );

  return new CompanyController(
    registerCompanyUseCase,
    getWithTransfersUseCase,
    getRecentUseCase,
  );
}
