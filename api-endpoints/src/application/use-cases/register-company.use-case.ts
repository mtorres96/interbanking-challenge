import { BadRequestException, ConflictException } from '@nestjs/common';
import { Company, CompanyType } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';

interface RegisterCompanyInput {
  cuit: string;
  businessName: string;
  type: CompanyType;
}

export class RegisterCompanyUseCase {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async execute(input: RegisterCompanyInput): Promise<void> {
    const exists = await this.companyRepo.findByCuit(input.cuit);
    if (exists) {
        throw new ConflictException(`Company with CUIT ${input.cuit} already exists`);
    }
    /* Optionally, we could also check for duplicate businessName values if we want to enforce uniqueness by name as well
    const sameName = await this.companyRepo.businessName(input.businessName);
    if (sameName.length > 0) {
        throw new BadRequestException(`Company with name "${input.businessName}" already exists`);
    }
    */

    const company = Company.create({
      cuit: input.cuit,
      businessName: input.businessName,
      type: input.type,
    });

    await this.companyRepo.save(company);
  }
}
