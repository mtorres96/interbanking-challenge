import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findAll(): Promise<Company[]>;
  findByCuit(cuit: string): Promise<Company | null>;
  findByBusinessName(businessName: string): Promise<Company[]>;
  findByAdhesionDateRange(startDate: Date, endDate: Date): Promise<Company[]>;
}
