import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import { Role } from 'src/role/role.type';
import * as mongoose from 'mongoose';

jest.setTimeout(40000);

const user = {
  userId: '621de1f21ee7e0b082154322',
  email: 'yetiasg@gmail.com',
  role: Role.COMPANY_ADMIN,
};

const mockCompanyData = {
  name: 'Selleo',
  description: 'Selleo - w&m',
  domain: 'selleo.com',
};

describe('Company controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CompanyModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /teams - create company', () => {
    it('returns true', async () => {
      return true;
    });
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await app.close();
  });
});
