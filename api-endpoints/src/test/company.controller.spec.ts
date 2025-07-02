import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../infrastructure/controllers/companies.controller';
import { RegisterCompanyUseCase } from '../application/use-cases/register-company.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from '../application/use-cases/get-recently-adhered-companies.use-case';
import { DataSource } from 'typeorm';
import { TypeOrmCompanyEntity } from '../infrastructure/persistence/typeorm-company.entity';
import { TypeOrmTransferEntity } from '../infrastructure/persistence/typeorm-transfer.entity';
import { TypeOrmCompanyRepository } from '../infrastructure/persistence/typeorm-company.repository';
import { TypeOrmTransferRepository } from '../infrastructure/persistence/typeorm-transfer.repository';

describe('CompanyController (TypeORM)', () => {
  let controller: CompanyController;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [TypeOrmCompanyEntity, TypeOrmTransferEntity],
    });

    await dataSource.initialize();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);

    const companyRepo = new TypeOrmCompanyRepository(
      dataSource.getRepository(TypeOrmCompanyEntity),
    );
    const transferRepo = new TypeOrmTransferRepository(
      dataSource.getRepository(TypeOrmTransferEntity),
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: RegisterCompanyUseCase,
          useValue: new RegisterCompanyUseCase(companyRepo),
        },
        {
          provide: GetCompaniesWithTransfersLastMonthUseCase,
          useValue: new GetCompaniesWithTransfersLastMonthUseCase(companyRepo, transferRepo),
        },
        {
          provide: GetRecentlyAdheredCompaniesUseCase,
          useValue: new GetRecentlyAdheredCompaniesUseCase(companyRepo),
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registers company successfully', async () => {
    const response = await controller.register({
      cuit: '20304059999',
      businessName: 'Empresa Nueva',
      type: 'PYME',
    });

    expect(response).toEqual({ message: 'Company registered successfully' });
  });

  it('throws 409 if CUIT already exists', async () => {


    await controller.register({
      cuit: '20304059999',
      businessName: 'Empresa Nueva',
      type: 'PYME',
    });

    await expect(controller.register({
      cuit: '20304059999',
      businessName: 'Empresa Nueva',
      type: 'PYME',
    })).rejects.toThrow(
      /already exists/i,
    );
  });

  it('throws 400 for invalid input (missing CUIT)', async () => {
    await expect(
      controller.register({
        businessName: 'Empresa',
        type: 'PYME',
      } as any),
    ).rejects.toThrow(/cuit/i);
  });
  it('should return 400 if data is invalid', async () => {
    await expect(controller.register({} as any)).rejects.toThrow();
  });

  it('returns recently adhered companies', async () => {
    await controller.register({
      cuit: '20304059999',
      businessName: 'Empresa Nueva',
      type: 'PYME',
    });
  
    const response = await controller.getRecentlyAdheredCompanies({ page: 1, limit: 10 });
    expect(response.total).toBe(1);
    expect(response.results[0].cuit).toBe('20304059999');
  });

  it('should default pagination to page=1, limit=10', async () => {
    const result = await controller.getCompaniesWithTransfers({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
  it('should default pagination to page=1, limit=10', async () => {
    const result = await controller.getRecentlyAdheredCompanies({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
