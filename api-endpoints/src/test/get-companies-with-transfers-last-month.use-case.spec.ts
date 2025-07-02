import { DataSource } from 'typeorm';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { TypeOrmCompanyRepository } from '../infrastructure/persistence/typeorm-company.repository';
import { TypeOrmTransferRepository } from '../infrastructure/persistence/typeorm-transfer.repository';
import { TypeOrmCompanyEntity } from '../infrastructure/persistence/typeorm-company.entity';
import { TypeOrmTransferEntity } from '../infrastructure/persistence/typeorm-transfer.entity';
import { Company } from '../domain/entities/company.entity';
import { Transfer } from '../domain/entities/transfer.entity';

describe('GetCompaniesWithTransfersLastMonthUseCase (TypeORM)', () => {
  let dataSource: DataSource;
  let companyRepo: TypeOrmCompanyRepository;
  let transferRepo: TypeOrmTransferRepository;
  let useCase: GetCompaniesWithTransfersLastMonthUseCase;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [TypeOrmCompanyEntity, TypeOrmTransferEntity],
    });
    await dataSource.initialize();

    companyRepo = new TypeOrmCompanyRepository(
      dataSource.getRepository(TypeOrmCompanyEntity),
    );
    transferRepo = new TypeOrmTransferRepository(
      dataSource.getRepository(TypeOrmTransferEntity),
    );

    useCase = new GetCompaniesWithTransfersLastMonthUseCase(companyRepo, transferRepo);
  });

  beforeEach(async () => {
    await dataSource.synchronize(true); // limpia las tablas
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('returns companies with transfers in last full month', async () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    const company = Company.create({
      cuit: '20304050601',
      businessName: 'Empresa SRL',
      type: 'PYME',
      joinedAt: new Date('2025-05-10'),
    });

    const transfer = Transfer.create({
      amount: 1000,
      companyId: '20304050601',
      debitAccount: 'ACC123',
      creditAccount: 'ACC456',
      createdAt: lastMonth,
    });

    await companyRepo.save(company);
    await transferRepo.save(transfer);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].companyId).toBe('20304050601');
  });
});
