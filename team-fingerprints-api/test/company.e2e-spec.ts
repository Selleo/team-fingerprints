import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import { Role } from 'src/role/role.type';
import * as mongoose from 'mongoose';
import { CompanyService } from 'src/company/company.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/models/company.model';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';

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
  let companyModel;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        CompanyModule,
        UsersModule,
        RoleModule,
        MongooseModule.forFeature([
          {
            name: Company.name,
            schema: CompanySchema,
          },
        ]),
      ],
      providers: [CompanyService],
    }).compile();

    app = moduleFixture.createNestApplication();
    companyModel = moduleFixture.get(getModelToken(Company.name));
    await app.init();
  });

  afterAll(async () => {
    const companies = await companyModel.find();
    await companyModel.findOneAndDelete({ _id: companies[0]._id });
    await mongoose.connection.close(true);
    await app.close();
  });

  describe('GET /companies - get list of companies', () => {
    it('returns empty array', async () => {
      return await request(app.getHttpServer())
        .get('/companies')
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
        .expect(403);
    });
  });

  describe('GET /companies - get company by id', () => {
    it('returns company by given id', async () => {
      let company;
      await request(app.getHttpServer())
        .get('/companies')
        .then(({ body }) => {
          company = body;
        });

      return await request(app.getHttpServer())
        .get(`/companies/${company[0]._id}`)
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
        .then(({ body }) => {
          company = body[0];
          expect(body.length).toBe(1);
        });

      return await request(app.getHttpServer())
        .post(`/companies/${company._id}/member`)
        .send({ email: 'yetiasgii@gmail.com' })
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

  describe('POST /companies/:companyId/member', () => {
    it('remove user from company', async () => {
      let company;
      await request(app.getHttpServer())
        .del('/companies')
        .then(({ body }) => {
          company = body;
        });

      return await request(app.getHttpServer())
        .delete(`/companies/${company._id}/member`)
        .send({ email: 'yetiasgii@gmail.com' })
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
          expect(emailWhitelist).toEqual([user.email]);
          expect(teams).toEqual([]);
        });
    });
  });
});
