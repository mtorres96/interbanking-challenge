import { GetRecentlyAdheredCompaniesUseCase } from "../application/use-cases/get-recently-adhered-companies.use-case";
import { Company } from "../domain/entities/company.entity";
import { InMemoryCompanyRepository } from "../infrastructure/persistence/in-memory-company.repository";


describe('GetRecentlyAdheredCompaniesUseCase', () => {
  let useCase: GetRecentlyAdheredCompaniesUseCase;
  let repo: InMemoryCompanyRepository;

  beforeEach(() => {
    repo = new InMemoryCompanyRepository();
    useCase = new GetRecentlyAdheredCompaniesUseCase(repo);
  });

  it('returns companies created within last 30 days', async () => {
    const recent = Company.create({
      cuit: '20304050601',
      businessName: 'Empresa Nueva',
      type: 'PYME',
      joinedAt: new Date(),
    });

    const old = Company.create({
      cuit: '20111222333',
      businessName: 'Antigua',
      type: 'CORPORATE',
      joinedAt: new Date('2020-01-01'),
    });

    await repo.save(recent);
    await repo.save(old);

    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });
});