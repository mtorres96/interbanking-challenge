import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { RegisterCompanyUseCase } from '../../application/use-cases/register-company.use-case';
import { GetCompaniesWithTransfersLastMonthUseCase } from '../../application/use-cases/get-companies-with-transfers-last-month.use-case';
import { GetRecentlyAdheredCompaniesUseCase } from '../../application/use-cases/get-recently-adhered-companies.use-case';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { RegisterCompanyDto } from 'src/common/dto/register-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly registerCompany: RegisterCompanyUseCase,
    private readonly getWithTransfers: GetCompaniesWithTransfersLastMonthUseCase,
    private readonly getRecentAdhered: GetRecentlyAdheredCompaniesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new company' })
  @ApiBody({ type: RegisterCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Company registered successfully',
    schema: {
      example: { message: 'Company registered successfully' },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate CUIT or invalid input',
    schema: {
      example: {
        statusCode: 409,
        message: 'Company with CUIT 20304050601 already exists',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  async register(
    @Body() body: RegisterCompanyDto,
  ): Promise<{ message: string }> {
    await this.registerCompany.execute(body);
    return { message: 'Company registered successfully' };
  }

  @Get('with-transfers')
  @ApiOperation({ summary: 'Get companies with transfers in last full month' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of companies with transfer activity',
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 1,
        results: [
          {
            amount: 12000,
            companyId: '20304050601',
            debitAccount: '100-0001',
            creditAccount: '100-0002',
          },
        ],
      },
    },
  })
  async getCompaniesWithTransfers(@Query() pagination: PaginationQueryDto) {
    const data = await this.getWithTransfers.execute();
    const { page = 1, limit = 10 } = pagination;
    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);
    return {
      page,
      limit,
      total: data.length,
      results: paginated,
    };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently adhered companies' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of companies registered in the last 30 days',
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 2,
        results: [
          {
            cuit: '20304050601',
            businessName: 'Empresa SRL',
            joinedAt: '2025-06-01T00:00:00Z',
            type: 'PYME',
          },
        ],
      },
    },
  })
  async getRecentlyAdheredCompanies(@Query() pagination: PaginationQueryDto) {
    const data = await this.getRecentAdhered.execute();
    const { page = 1, limit = 10 } = pagination;
    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);
    return {
      page,
      limit,
      total: data.length,
      results: paginated,
    };
  }
}
