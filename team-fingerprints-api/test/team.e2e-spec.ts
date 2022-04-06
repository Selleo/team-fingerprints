import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Team } from 'src/company/models/team.model';
import { CreateTeamDto } from 'src/company/team/dto/team.dto';

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

  describe('GET /companies/:companyId/teams - get all teams in company', () => {
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

  describe('GET /companies/:companyId/teams/:teamId - get team by id', () => {
    it('returns team', async () => {
      const newTeam = (
        await createTeamInCompany(companyModel, company._id.toString())
      ).teams[0];

      const {
        body: { team },
      } = await request(app.getHttpServer())
        .get(
          `/companies/${company._id.toString()}/teams/${newTeam._id.toString()}`,
        )
        .expect(200);

      expect(team._id).toEqual(newTeam._id.toString());
      expect(team.name).toEqual(newTeam.name);
      expect(team.pointColor).toEqual(newTeam.pointColor);
      expect(team.pointShape).toEqual(newTeam.pointShape);
      expect(team.filterTemplates).toEqual(newTeam.filterTemplates);
    });
  });

  describe('POST /companies/:companyId/teams - create team', () => {
    it('returns new team', async () => {
      const teamData: CreateTeamDto = {
        name: 'Team test',
        pointColor: '#abc321',
        pointShape: 'triangle',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/companies/${company._id.toString()}/teams`)
        .send(teamData)
        .expect(201);

      const team = body.teams[0];

      expect(team._id).toBeDefined();
      expect(team.name).toEqual(teamData.name);
      expect(team.pointColor).toEqual(teamData.pointColor);
      expect(team.pointShape).toEqual(teamData.pointShape);
    });
  });

  describe('PATCH /companies/:companyId/teams/:teamId - update team', () => {
    it('returns company with updated team', async () => {
      const newTeam = (
        await createTeamInCompany(companyModel, company._id.toString())
      ).teams[0];

      const updateTeamData: CreateTeamDto = {
        name: 'Team test - updated',
        pointColor: '#654321',
        pointShape: 'circle',
      };

      const { body } = await request(app.getHttpServer())
        .patch(
          `/companies/${company._id.toString()}/teams/${newTeam._id.toString()}`,
        )
        .send(updateTeamData)
        .expect(200);

      const team = body.teams[0];

      expect(team._id).toBeDefined();
      expect(team.name).toEqual(updateTeamData.name);
      expect(team.pointColor).toEqual(updateTeamData.pointColor);
      expect(team.pointShape).toEqual(updateTeamData.pointShape);
    });
  });
});
