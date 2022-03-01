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

  describe('GET /companies - get list of companies', () => {
    it('returns empty array', async () => {
      return await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
  });

  describe('POST /companies - create company', () => {
    it('throws exceptions if passed data is invalid', async () => {
      return await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: '',
          description: '',
          domain: 'as',
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('returns created company', async () => {
      return await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: mockCompanyData.name,
          description: mockCompanyData.description,
          domain: mockCompanyData.domain,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .then(({ body }) => {
          const {
            name,
            description,
            domain,
            adminId,
            members,
            emailWhitelist,
            teams,
          } = body;
          expect(name).toBe(mockCompanyData.name);
          expect(description).toBe(mockCompanyData.description);
          expect(domain).toBe(mockCompanyData.domain);
          expect(adminId).toEqual([user.userId]);
          expect(members).toEqual([user.userId]);
          expect(emailWhitelist).toEqual([user.email]);
          expect(teams).toEqual([]);
        });
    });

    it('throws an error if company domain is taken', async () => {
      return await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'company name',
          description: 'company description',
          domain: mockCompanyData.domain,
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe('GET /companies - get company by id', () => {
    it('returns company by given id', async () => {
      let company;
      await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .then(({ body }) => {
          company = body;
        });

      return await request(app.getHttpServer())
        .get(`/companies/${company[0]._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then(({ body }) => {
          const {
            name,
            description,
            domain,
            adminId,
            members,
            emailWhitelist,
            teams,
          } = body;
          expect(name).toBe(mockCompanyData.name);
          expect(description).toBe(mockCompanyData.description);
          expect(domain).toBe(mockCompanyData.domain);
          expect(adminId).toEqual([user.userId]);
          expect(members).toEqual([user.userId]);
          expect(emailWhitelist).toEqual([user.email]);
          expect(teams).toEqual([]);
        });
    });
  });

  describe('PATCH /companies - update company', () => {
    it('updates company partialy', async () => {
      let company;
      await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .then(({ body }) => {
          company = body[0];
          expect(body.length).toBe(1);
        });

      return await request(app.getHttpServer())
        .patch(`/companies/${company._id}`)
        .send({
          name: 'leo',
          description: 'leo',
          domain: 'leo.com',
        })
        .set('Authorization', `Bearer ${authToken}`)
        .then(({ body }) => {
          const {
            name,
            description,
            domain,
            adminId,
            members,
            emailWhitelist,
            teams,
          } = body;
          expect(name).toBe('leo');
          expect(description).toBe('leo');
          expect(domain).toBe('leo.com');
          expect(adminId).toEqual([user.userId]);
          expect(members).toEqual([user.userId]);
          expect(emailWhitelist).toEqual([user.email]);
          expect(teams).toEqual([]);
        });
    });
  });

  describe('POST /companies/:companyId/member', () => {
    it('adds user to company whitelist', async () => {
      let company;
      await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .then(({ body }) => {
          company = body[0];
          expect(body.length).toBe(1);
        });

      return await request(app.getHttpServer())
        .post(`/companies/${company._id}/member`)
        .send({ email: 'yetiasgii@gmail.com' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .then(({ body }) => {
          const {
            name,
            description,
            domain,
            adminId,
            members,
            emailWhitelist,
            teams,
          } = body;
          expect(name).toBe('leo');
          expect(description).toBe('leo');
          expect(domain).toBe('leo.com');
          expect(adminId).toEqual([user.userId]);
          expect(members).toEqual([user.userId]);
          expect(emailWhitelist).toEqual([user.email, 'yetiasgii@gmail.com']);
          expect(teams).toEqual([]);
        });
    });
  });

  describe('DELETE /companies - remove compaby by id', () => {
    it('removes company by given id', async () => {
      let company;
      await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .then(({ body }) => {
          company = body[0];
          expect(body.length).toBe(1);
        });

      return await request(app.getHttpServer())
        .delete(`/companies/${company._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then(({ body }) => {
          const {
            name,
            description,
            domain,
            adminId,
            members,
            emailWhitelist,
            teams,
          } = body;
          expect(name).toBe('leo');
          expect(description).toBe('leo');
          expect(domain).toBe('leo.com');
          expect(adminId).toEqual([user.userId]);
          expect(members).toEqual([user.userId]);
          expect(emailWhitelist).toEqual([user.email, 'yetiasgii@gmail.com']);
          expect(teams).toEqual([]);
        });
    });

    it('returns empty array', async () => {
      return await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
