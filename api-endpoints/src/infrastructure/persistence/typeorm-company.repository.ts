import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { CompanyRepository } from "src/domain/repositories/company.repository";
import { Company } from "src/domain/entities/company.entity";
import { TypeOrmCompanyEntity } from "./typeorm-company.entity";
import { CompanyMapper } from "./company-mapper";

@Injectable()
export class TypeOrmCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(TypeOrmCompanyEntity)
    private readonly repo: Repository<TypeOrmCompanyEntity>
  ) {}

  async save(company: Company): Promise<Company> {
    const entity = CompanyMapper.toPersistence(company);
    const saved = await this.repo.save(entity);
    return CompanyMapper.toDomain(saved);
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    const entity = await this.repo.findOne({ where: { cuit } });
    return entity ? CompanyMapper.toDomain(entity) : null;
  }

  async findAdheredSince(date: Date): Promise<Company[]> {
    const entities = await this.repo.find({
      where: { joinedAt: MoreThanOrEqual(date) },
    });
    return entities.map(CompanyMapper.toDomain);
  }

  async findAdheredSincePaginatedWithTotal(
    date: Date,
    offset: number,
    limit: number
  ): Promise<{ results: Company[]; total: number }> {
    const [entities, total] = await this.repo.findAndCount({
      where: { joinedAt: MoreThanOrEqual(date) },
      order: { joinedAt: "DESC" },
      skip: offset,
      take: limit,
    });
    return {
      results: entities.map(CompanyMapper.toDomain),
      total,
    };
  }
}
