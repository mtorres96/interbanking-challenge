import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TypeOrmCompanyEntity } from '../infrastructure/persistence/typeorm-company.entity';
import { TypeOrmTransferEntity } from '../infrastructure/persistence/typeorm-transfer.entity';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_PATH || './data/database.sqlite',
    synchronize: true, // only for development
    entities: [TypeOrmCompanyEntity, TypeOrmTransferEntity],
  });

  await dataSource.initialize();

  const companyRepo = dataSource.getRepository(TypeOrmCompanyEntity);
  const transferRepo = dataSource.getRepository(TypeOrmTransferEntity);

  const companiesRaw = await readFile(join(__dirname, '../../data/companies.mock.json'), 'utf-8');
  const transfersRaw = await readFile(join(__dirname, '../../data/transfers.mock.json'), 'utf-8');

  const companies = JSON.parse(companiesRaw);
  const transfers = JSON.parse(transfersRaw);

  await companyRepo.clear();
  await transferRepo.clear();

  await companyRepo.save(companies);
  await transferRepo.save(
    transfers.map((t: any) => ({
      ...t,
      createdAt: t.date,
    })),
  );

  console.log('✅ Seed completed successfully');
  await dataSource.destroy();
}

runSeed().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
