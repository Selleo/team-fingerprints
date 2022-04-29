import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import { getModelToken } from '@nestjs/mongoose';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
} from 'src/company/dto/company.dto';
import { RoleModel } from 'src/role/models/role.model';
import { RoleType } from 'team-fingerprints-common';

const createCompany = async (companyModel: Model<CompanyModel>) => {
  const companyData: Partial<CompanyModel> = {
    name: 'Company test',
    pointColor: '#ab34bf',
    pointShape: 'triangle',
    teams: [],
    domain: 'example.com',
    filterTemplates: [],
  };

  return await (await companyModel.create(companyData)).save();
};

describe('CompanyController', () => {
  let app: INestApplication;
  let companyModel: Model<CompanyModel>;
  let roleModel: Model<RoleModel>;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(CompanyModel.name));
    roleModel = app.get(getModelToken(RoleModel.name));
  });

  describe('GET /companies - get companies', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/companies')
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one company', async () => {
      await createCompany(companyModel);

      const { body } = await request(app.getHttpServer())
        .get('/companies')
        .expect(200);

      expect(body.length).toBe(1);
      expect(body).not.toEqual([]);
    });
  });

  describe('GET /companies/:companyId - get company by id', () => {
    it('returns company', async () => {
      const newCompany = await createCompany(companyModel);

      const { body } = await request(app.getHttpServer())
        .get(`/companies/${newCompany._id.toString()}`)
        .expect(200);

      const { company } = body;

      expect(company._id).toEqual(newCompany._id.toString());
      expect(company.filterTemplates).toEqual(newCompany.filterTemplates);
      expect(company.domain).toEqual(newCompany.domain);
      expect(company.teams).toEqual(newCompany.teams);
      expect(company.pointColor).toEqual(newCompany.pointColor);
      expect(company.pointShape).toEqual(newCompany.pointShape);
      expect(company.name).toEqual(newCompany.name);
    });
  });

  describe('POST /companies - create company', () => {
    it('returns new company', async () => {
      const companyData: CreateCompanyDto = {
        name: 'Company test',
        pointColor: '#ab34bf',
        pointShape: 'triangle',
        domain: 'example.com',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/companies`)
        .send(companyData)
        .expect(201);

      expect(body.domain).toEqual(companyData.domain);
      expect(body.description).toEqual('');
      expect(body.pointColor).toEqual(companyData.pointColor);
      expect(body.pointShape).toEqual(companyData.pointShape);
      expect(body.name).toEqual(companyData.name);
    });

    it('returns bad request exception for invalid domain', async () => {
      const companyData: CreateCompanyDto = {
        name: 'Company test',
        pointColor: '#ab34bf',
        pointShape: 'triangle',
        domain: 'example',
      };

      await request(app.getHttpServer())
        .post(`/companies`)
        .send(companyData)
        .expect(400);
    });
  });

  describe('PATCH /companies/:companyId - update company', () => {
    it('returns new company', async () => {
      const newCompany = await createCompany(companyModel);

      const updateCompanyData: UpdateCompanyDto = {
        name: 'Company test - updated',
        pointColor: '#ffffff',
        pointShape: 'circle',
        domain: 'test.com',
      };

      const { body } = await request(app.getHttpServer())
        .patch(`/companies/${newCompany._id.toString()}`)
        .send(updateCompanyData)
        .expect(200);

      expect(body.domain).toEqual(updateCompanyData.domain);
      expect(body.description).toEqual('');
      expect(body.pointColor).toEqual(updateCompanyData.pointColor);
      expect(body.pointShape).toEqual(updateCompanyData.pointShape);
      expect(body.name).toEqual(updateCompanyData.name);
    });
  });

  describe('POST /companies/:companyId/member - add member to company by email', () => {
    it('returns new company', async () => {
      const newCompany = await createCompany(companyModel);

      const members = { emails: ['kinnyzimmer@gmail.com'] };

      const { body } = await request(app.getHttpServer())
        .post(`/companies/${newCompany._id.toString()}/member`)
        .send(members)
        .expect(201);

      const roleDocument = await roleModel
        .findOne({
          companyId: newCompany._id.toString(),
          role: RoleType.USER,
          email: members.emails[0],
        })
        .exec();

      expect(body).toEqual(members.emails);
      expect(roleDocument).toBeDefined();
    });
  });

  describe('POST /companies/:companyId/member - add member to company by email', () => {
    it('returns new company', async () => {
      const newCompany = await createCompany(companyModel);

      const companyAdmin = { email: 'kinnyzimmer@gmail.com' };

      const { body } = await request(app.getHttpServer())
        .post(`/companies/${newCompany._id.toString()}/companyAdmin`)
        .send(companyAdmin)
        .expect(201);

      const roleDocument = await roleModel
        .findOne({
          companyId: newCompany._id.toString(),
          role: RoleType.COMPANY_ADMIN,
          email: companyAdmin.email,
        })
        .exec();

      expect(body._id.toString()).toEqual(roleDocument._id.toString());
      expect(body.companyId).toEqual(roleDocument.companyId);
      expect(body.email).toEqual(roleDocument.email);
      expect(body.role).toEqual(roleDocument.role);
    });
  });
});
