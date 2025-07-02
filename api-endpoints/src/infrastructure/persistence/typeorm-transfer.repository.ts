import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { TransferRepository } from "src/domain/repositories/transfer.repository";
import { TypeOrmTransferEntity } from "./typeorm-transfer.entity";
import { TransferMapper } from "./transfer.mapper";
import { Transfer } from "src/domain/entities/transfer.entity";

@Injectable()
export class TypeOrmTransferRepository implements TransferRepository {
  constructor(
    @InjectRepository(TypeOrmTransferEntity)
    private readonly repo: Repository<TypeOrmTransferEntity>
  ) {}

  async findByDateRange(from: Date, to: Date): Promise<Transfer[]> {
    const entities = await this.repo.find({
      where: {
        createdAt: Between(from, to),
      },
    });
    return entities.map(TransferMapper.toDomain);
  }

  async save(transfer: Transfer): Promise<Transfer> {
    const entity = TransferMapper.toPersistence(transfer);
    const saved = await this.repo.save(entity);
    return TransferMapper.toDomain(saved);
  }

  async findByDateRangePaginatedWithTotal(
    start: Date,
    end: Date,
    offset: number,
    limit: number
  ): Promise<{ results: Transfer[]; total: number }> {
    const [entities, total] = await this.repo.findAndCount({
      where: {
        createdAt: Between(start, end),
      },
      order: { createdAt: "DESC" },
      skip: offset,
      take: limit,
    });

    return {
      results: entities.map(TransferMapper.toDomain),
      total,
    };
  }
}
