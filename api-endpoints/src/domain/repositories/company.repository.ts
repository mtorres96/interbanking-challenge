import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
  abstract save(company: Company): Promise<Company>;
  abstract findByCuit(cuit: string): Promise<Company | null>;
  abstract findAdheredSince(date: Date): Promise<Company[]>;
  abstract findAdheredSincePaginatedWithTotal(
    date: Date,
    offset: number,
    limit: number
  ): Promise<{ results: Company[]; total: number }>;
}
