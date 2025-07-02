import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);

    // Limpiar base antes del test
    await dataSource.query(`DELETE FROM company`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 400 if CUIT is invalid (less than 11 digits)', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        cuit: '123',
        businessName: 'Empresa Inválida',
        type: 'PYME',
      })
      .expect(400);

    expect(res.body.message).toContain('CUIT must be 11 digits');
  });

  it('should return 400 if required field is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        cuit: '20304050601',
        // Falta businessName
        type: 'PYME',
      })
      .expect(400);

    expect(res.body.message).toContain('businessName should not be empty');
  });

  it('should register a company successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        cuit: '20304050601',
        businessName: 'Empresa OK',
        type: 'PYME',
      })
      .expect(201);

    expect(res.body.message).toBe('Company registered successfully');
  });

  it('should return 409 if CUIT already exists', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .send({
        cuit: '20304050601',
        businessName: 'Empresa Duplicada',
        type: 'PYME',
      })
      .expect(409);

    expect(res.body.message).toContain('already exists');
  });

  it('should list recently adhered companies', async () => {
    const res = await request(app.getHttpServer())
      .get('/companies/recent')
      .query({ page: 1, limit: 10 })
      .expect(200);
  
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.results[0].cuit).toBe('20304050601');
  });
  
});
