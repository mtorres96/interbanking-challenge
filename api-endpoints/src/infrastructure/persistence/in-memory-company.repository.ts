import { Injectable } from '@nestjs/common';
import { Company } from 'src/domain/entities/company.entity';
import { CompanyRepository } from 'src/domain/repositories/company.repository';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InMemoryCompanyRepository implements CompanyRepository {
  private companies: Company[] = [];

  constructor() {
    const dataPath = path.resolve(__dirname, '../../../data/companies.mock.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(raw);
      this.companies = parsed.map(
        (c: any) =>
          new Company(c.cuit, c.businessName, new Date(c.joinedAt), c.tipo),
      );
    }
  }

  async save(company: Company): Promise<void> {
    this.companies.push(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companies;
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    return this.companies.find((c) => c.cuit === cuit) ?? null;
  }

  async findByBusinessName(businessName: string): Promise<Company[]> {
    return this.companies.filter((c) => c.businessName === businessName);
  }

  async findByAdhesionDateRange(start: Date, end: Date): Promise<Company[]> {
    return this.companies.filter(
      (c) => c.joinedAt >= start && c.joinedAt <= end,
    );
  }
}
