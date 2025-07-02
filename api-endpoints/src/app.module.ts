import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './infrastructure/controllers/companies.controller';
import { RegisterCompanyUseCase } from './application/use-cases/register-company.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from './application/use-cases/get-recently-adhered-companies.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from './application/use-cases/get-companies-with-transfers-last-month.use-case';
import { HealthModule } from './infrastructure/health/health.module';
import { TypeOrmCompanyEntity } from './infrastructure/persistence/typeorm-company.entity';
import { TypeOrmTransferEntity } from './infrastructure/persistence/typeorm-transfer.entity';
import { TypeOrmCompanyRepository } from './infrastructure/persistence/typeorm-company.repository';
import { TypeOrmTransferRepository } from './infrastructure/persistence/typeorm-transfer.repository';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || './data/database.sqlite',
      entities: [TypeOrmCompanyEntity, TypeOrmTransferEntity],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([TypeOrmCompanyEntity, TypeOrmTransferEntity]),
  ],
  controllers: [CompanyController],
  providers: [
    TypeOrmCompanyRepository,
    TypeOrmTransferRepository,

    {
      provide: RegisterCompanyUseCase,
      useFactory: (companyRepo: TypeOrmCompanyRepository) => {
        return new RegisterCompanyUseCase(companyRepo);
      },
      inject: [TypeOrmCompanyRepository],
    },
    {
      provide: GetRecentlyAdheredCompaniesUseCase,
      useFactory: (companyRepo: TypeOrmCompanyRepository) => {
        return new GetRecentlyAdheredCompaniesUseCase(companyRepo);
      },
      inject: [TypeOrmCompanyRepository],
    },
    {
      provide: GetCompaniesWithTransfersLastMonthUseCase,
      useFactory: (
        companyRepo: TypeOrmCompanyRepository,
        transferRepo: TypeOrmTransferRepository,
      ) => {
        return new GetCompaniesWithTransfersLastMonthUseCase(
          companyRepo,
          transferRepo,
        );
      },
      inject: [TypeOrmCompanyRepository, TypeOrmTransferRepository],
    },
  ],
})
export class AppModule {}
