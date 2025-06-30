import { InMemoryCompanyRepository } from '../infrastructure/persistence/in-memory-company.repository';
import { RegisterCompanyUseCase } from '../application/use-cases/register-company.use-case';

describe('RegisterCompanyUseCase', () => {
  let useCase: RegisterCompanyUseCase;
  let repo: InMemoryCompanyRepository;

  beforeEach(() => {
    repo = new InMemoryCompanyRepository();
    useCase = new RegisterCompanyUseCase(repo);
  });

  it('should register a new company', async () => {
    await useCase.execute({
      cuit: '20304099991',
      businessName: 'Empresa 1',
      type: 'PYME',
    });

    const saved = await repo.findByCuit('20304050601');
    expect(saved).toBeDefined();
    expect(saved?.businessName).toBe('Manuel Torres SRL');
  });

  it('should throw if company with same CUIT exists', async () => {
    await useCase.execute({
      cuit: '20304099991',
      businessName: 'Empresa 1',
      type: 'PYME',
    });

    await expect(
      useCase.execute({
        cuit: '20304050601',
        businessName: 'Otra empresa',
        type: 'CORPORATE',
      }),
    ).rejects.toThrow(/already exists/);
  });
});
