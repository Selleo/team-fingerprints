import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Team } from 'src/company/models/team.model';

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

const createTeamInCompany = async (
  companyModel: Model<Company>,
  companyId: string,
) => {
  const teamData: Partial<Team> = {
    name: 'Company test',
    pointColor: '#ab34bf',
    pointShape: 'triangle',
    filterTemplates: [],
  };

  return await companyModel
    .findByIdAndUpdate(
      companyId,
      {
        $push: {
          teams: teamData,
        },
      },
      { new: true },
    )
    .exec();
};

describe('TeamController', () => {
  let app: INestApplication;
  let companyModel: Model<Company>;
  let company: Company;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(Company.name));
    company = await createCompany(companyModel);
  });

  describe('GET /teams - get all teams in company', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/companies/${company._id.toString()}`)
        .expect(200);

      const { teams } = body.company;
      expect(teams.length).toBe(0);
      expect(teams).toEqual([]);
    });

    it('returns array with one team', async () => {
      await createTeamInCompany(companyModel, company._id.toString());

      const { body } = await request(app.getHttpServer())
        .get(`/companies/${company._id.toString()}`)
        .expect(200);

      const { teams } = body.company;

      expect(teams.length).toBe(1);
      expect(teams).not.toEqual([]);
    });
  });
});
