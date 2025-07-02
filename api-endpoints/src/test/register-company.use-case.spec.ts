import { RegisterCompanyUseCase } from '../application/use-cases/register-company.use-case';
import { Company } from '../domain/entities/company.entity';

describe('RegisterCompanyUseCase', () => {
  let useCase: RegisterCompanyUseCase;
  let mockRepo: {
    findByCuit: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    mockRepo = {
      findByCuit: jest.fn(),
      save: jest.fn(),
    };

    useCase = new RegisterCompanyUseCase(mockRepo as any);
  });

  it('should register a new company', async () => {
    mockRepo.findByCuit.mockResolvedValue(null);

    await useCase.execute({
      cuit: '20304099991',
      businessName: 'Empresa 1',
      type: 'PYME',
    });

    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cuit: '20304099991',
        businessName: 'Empresa 1',
        type: 'PYME',
      }),
    );
  });

  it('should throw if company with same CUIT exists', async () => {
    mockRepo.findByCuit.mockResolvedValue(
      new Company('20304099991', 'Ya existe', new Date(), 'PYME'),
    );

    await expect(
      useCase.execute({
        cuit: '20304099991',
        businessName: 'Duplicada',
        type: 'CORPORATE',
      }),
    ).rejects.toThrow(/already exists/i);
  });
});
