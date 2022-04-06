import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import { getModelToken } from '@nestjs/mongoose';

const createCompany = async (companyModel: Model<Company>) => {
  const companyData: Partial<Company> = {
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
  let companyModel: Model<Company>;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(Company.name));
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
});
