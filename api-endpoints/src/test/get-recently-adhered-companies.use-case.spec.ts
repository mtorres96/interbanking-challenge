import { GetRecentlyAdheredCompaniesUseCase } from "../application/use-cases/get-recently-adhered-companies.use-case";
import { Company } from "../domain/entities/company.entity";

describe('GetRecentlyAdheredCompaniesUseCase', () => {
  let useCase: GetRecentlyAdheredCompaniesUseCase;
  let mockRepo: { findAdheredSincePaginatedWithTotal: jest.Mock };

  beforeEach(() => {
    mockRepo = {
      findAdheredSincePaginatedWithTotal: jest.fn(),
    };

    useCase = new GetRecentlyAdheredCompaniesUseCase(mockRepo as any);
  });

  it('returns companies created within last 30 days', async () => {
    const now = new Date();
    const recentCompany = Company.create({
      cuit: '20304050601',
      businessName: 'Empresa Nueva',
      type: 'PYME',
      joinedAt: now,
    });

    mockRepo.findAdheredSincePaginatedWithTotal.mockResolvedValue({
      data: [recentCompany],
      total: 1,
    });

    const result = await useCase.execute({ page: 1, limit: 1 });

    expect(result.total).toBe(1); 
  });
});
