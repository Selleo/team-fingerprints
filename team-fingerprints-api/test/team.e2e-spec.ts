import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import { Role } from 'src/role/role.type';

const authToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM0ZVVpMFVfdVlnYlpjbV9fSXBDYSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sbGt0ZTQxbS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDU5ODkyODA1NTgxNDkzOTIyMjIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyIsImh0dHBzOi8vZGV2LWxsa3RlNDFtLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDYxMzYzMDEsImV4cCI6MTY0NjIyMjcwMSwiYXpwIjoiZ3FHWVFOaXM2SldmbXBkTlE1dG14Vlc5N1NHUHp6dmwiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.0rfGRowBkBWLqLp3p28MwvwYNZp67v6TcEjurPDZNrWLrbjUva-TF5m-m3ER02h39ijCe8fdNirx-ip19jZ7mXduR46szd2UXgYHfZx9qUWxOUWj_pNKx6qiAcCWE4SfJaNjPA7A-hliMtJFfU-YiNa-Y6ZHQftdU569L_HXeRQf7YFNmxKSVG3ScVwLtPRmblNKni1lT0HNue3jq2VdpnyLw1O2Qnkfq1XfjUilC75lbFX0R9WwCSb8P8SFibK9yNHUPFLyspkq2WAoII520NsucXK3WQYNKNVK6Zpea7Ha_Y8vlqH9H4lpgNp50UJ37GAXohrLhQj5FDi9Y3hh6g';

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
      console.log(false);
      return true;
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
