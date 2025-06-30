import { GetCompaniesWithTransfersLastMonthUseCase } from "../application/use-cases/get-companies-with-transfers-last-month.use-case";
import { InMemoryCompanyRepository } from "../infrastructure/persistence/in-memory-company.repository";
import { InMemoryTransferRepository } from "../infrastructure/persistence/in-memory-transfer.repository";


describe('GetCompaniesWithTransfersLastMonthUseCase', () => {
  let useCase: GetCompaniesWithTransfersLastMonthUseCase;
  let repo: InMemoryTransferRepository;
  let companyRepo: InMemoryCompanyRepository;

  beforeEach(() => {
    repo = new InMemoryTransferRepository();
    companyRepo = new InMemoryCompanyRepository();
    useCase = new GetCompaniesWithTransfersLastMonthUseCase(companyRepo,repo);
  });

  it('returns companies with transfers in last full month', async () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    repo.save({
      amount: 1000,
      companyId: '20304050601',
      debitAccount: 'ACC123',
      creditAccount: 'ACC456',
      date: oneMonthAgo,
    });

    const result = await useCase.execute();
    expect(result).toHaveLength(2);
    expect(result[0].companyId).toBe('20304050601');
  });
});