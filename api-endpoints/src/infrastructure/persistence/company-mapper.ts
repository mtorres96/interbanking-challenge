import { Company } from "src/domain/entities/company.entity";
import { TypeOrmCompanyEntity } from './typeorm-company.entity';

export class CompanyMapper {
  static toPersistence(domain: Company): TypeOrmCompanyEntity {
    const entity = new TypeOrmCompanyEntity();
    entity.cuit = domain.cuit;
    entity.businessName = domain.businessName;
    entity.joinedAt = domain.joinedAt;
    entity.type = domain.type;
    return entity;
  }

  static toDomain(entity: TypeOrmCompanyEntity): Company {
    return Company.create({
      cuit: entity.cuit,
      businessName: entity.businessName,
      joinedAt: entity.joinedAt,
      type: entity.type,
    });
  }
}