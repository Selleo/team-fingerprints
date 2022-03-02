import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import { Role } from 'src/role/role.type';

const authToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM0ZVVpMFVfdVlnYlpjbV9fSXBDYSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sbGt0ZTQxbS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDU5ODkyODA1NTgxNDkzOTIyMjIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyIsImh0dHBzOi8vZGV2LWxsa3RlNDFtLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDYyMjI3MzIsImV4cCI6MTY0NjMwOTEzMiwiYXpwIjoiZ3FHWVFOaXM2SldmbXBkTlE1dG14Vlc5N1NHUHp6dmwiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.IKgSjG0LPXS67JFtTNqbZ5tCqB-Gwj_OcElK065bC9rqENHtHqxo3C8riEDL_FYd7-zwzOHOemuYJnd2PwABgdj8LUDQEQmFZ_BHlYoHXSSqYjh1BO3vLLFkn1kdBsZHN_5BDtpLLvMfj0ZghCTVZOlWzCK9rlhpwDhrzl7BtBYBNnLPMrhZyPQKVXBTLP7dgk0YdwlmCAheNBSJkR9l1BFiXJCpIhex1tfQMwuHpKHLbaY-E3QMSI1e2iEXoWrFEUjYxSPU2rKP11CXOP1mZhI8sd6HeAW3S-zAZNCHs-iSLx4U2-mUqXJJgMKcMqiR0eZYirYoabSCUszfw7DbfA';

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

jest.setTimeout(40000);

describe('Company controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.setTimeout(10000);
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
    await app.close();
  });
});
