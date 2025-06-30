import { Test, TestingModule } from '@nestjs/testing';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from '../application/use-cases/get-recently-adhered-companies.use-case';
import { RegisterCompanyUseCase } from '../application/use-cases/register-company.use-case';
import { CompanyController } from '../infrastructure/controllers/companies.controller';
import { InMemoryCompanyRepository } from '../infrastructure/persistence/in-memory-company.repository';
import { InMemoryTransferRepository } from '../infrastructure/persistence/in-memory-transfer.repository';


describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const companyRepo = new InMemoryCompanyRepository();
    const transferRepo = new InMemoryTransferRepository();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: RegisterCompanyUseCase,
          useValue: new RegisterCompanyUseCase(companyRepo),
        },
        {
          provide: GetCompaniesWithTransfersLastMonthUseCase,
          useValue: new GetCompaniesWithTransfersLastMonthUseCase(companyRepo,transferRepo),
        },
        {
          provide: GetRecentlyAdheredCompaniesUseCase,
          useValue: new GetRecentlyAdheredCompaniesUseCase(companyRepo),
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registers company successfully', async () => {
    const response = await controller.register({
      cuit: '20304050603',
      businessName: 'Empresa Test',
      type: 'PYME',
    });

    expect(response.message).toBe('Company registered successfully');
  });
});