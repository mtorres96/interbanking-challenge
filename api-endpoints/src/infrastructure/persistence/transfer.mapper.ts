import { Transfer } from "src/domain/entities/transfer.entity";
import { TypeOrmTransferEntity } from './typeorm-transfer.entity';

export class TransferMapper {
  static toPersistence(domain: Transfer): TypeOrmTransferEntity {
    const entity = new TypeOrmTransferEntity();
    entity.companyId = domain.companyId;
    entity.amount = domain.amount;
    entity.debitAccount = domain.debitAccount;
    entity.creditAccount = domain.creditAccount;
    entity.createdAt = domain.createdAt;
    return entity;
  }

  static toDomain(entity: TypeOrmTransferEntity): Transfer {
    return Transfer.create({
      companyId: entity.companyId,
      amount: entity.amount,
      debitAccount: entity.debitAccount,
      creditAccount: entity.creditAccount,
      createdAt: entity.createdAt,
    });
  }
}
