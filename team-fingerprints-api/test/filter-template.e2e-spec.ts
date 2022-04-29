import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import * as request from 'supertest';
import { getApplication } from './helpers/getApplication';

const createCompanyWithTeam = async (
  companyModel: Model<CompanyModel>,
): Promise<CompanyModel> => {
  const teamData = {
    _id: new Types.ObjectId(),
    name: 'Test team',
    pointColor: '#fffaaa',
    pointShape: 'square',
    filterTemplates: [],
  };

  const companyData = {
    name: 'Test company',
    pointColor: '#fffaaa',
    pointShape: 'square',
    teams: [teamData],
    domain: 'example.com',
    filterTemplates: [],
  };

  return await (await companyModel.create(companyData)).save();
};

const createFilterTemplateInCompany = async (
  companyModel: Model<CompanyModel>,
  companyId: string,
) => {
  const filterTemplateData = {
    _id: new Types.ObjectId().toString(),
    country: 'Croatia',
    name: 'Test template filter',
    pointColor: '#123456',
    pointShape: 'circle',
  };

  return await companyModel.findByIdAndUpdate(
    companyId,
    {
      $push: { filterTemplates: filterTemplateData },
    },
    { new: true },
  );
};

const createFilterTemplateInTeam = async (
  companyModel: Model<CompanyModel>,
  companyId: string,
  teamId: string,
) => {
  const filterTemplateData = {
    _id: new Types.ObjectId().toString(),
    country: 'Slovakia',
    name: 'Test template filter',
    pointColor: '#abcdef',
    pointShape: 'square',
  };

  return await companyModel.findByIdAndUpdate(
    { _id: companyId },
    {
      $push: { 'teams.$[team].filterTemplates': filterTemplateData },
    },
    { arrayFilters: [{ 'team._id': teamId }], new: true },
  );
};

describe('FilterTemplateController', () => {
  let app: INestApplication;
  let companyModel: Model<CompanyModel>;
  let company: CompanyModel;
  let companyId: string;
  let teamId: string;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(CompanyModel.name));
    company = await createCompanyWithTeam(companyModel);
    companyId = company._id.toString();
    teamId = company.teams[0]._id.toString();
  });

  describe('GET /filter-templates/:companyId/filters - get filter templates for company', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${companyId}/filters`)
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one filter template', async () => {
      await createFilterTemplateInCompany(companyModel, companyId);

      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${companyId}/filters`)
        .expect(200);

      expect(body.length).toBe(1);
    });
  });

  describe('POST /filter-templates/:companyId/filters - create filter templates for company', () => {
    it('returns company with one filter template', async () => {
      const filterTemplateData = {
        templateFilter: {
          country: 'Poland',
          yearOfExperience: '<1',
          level: 'Junior',
        },
        templateFilterConfig: {
          name: 'Test template filter',
          pointColor: '#123456',
          pointShape: 'circle',
        },
      };

      const { body } = await request(app.getHttpServer())
        .post(`/filter-templates/${companyId}/filters`)
        .send(filterTemplateData)
        .expect(201);

      const filterTemplate = body.filterTemplates[0];

      expect(filterTemplate._id.toString()).toBeDefined();
      expect(filterTemplate.name).toEqual(
        filterTemplateData.templateFilterConfig.name,
      );
      expect(filterTemplate.pointColor).toEqual(
        filterTemplateData.templateFilterConfig.pointColor,
      );
      expect(filterTemplate.pointShape).toEqual(
        filterTemplateData.templateFilterConfig.pointShape,
      );
      expect(filterTemplate.country).toEqual(
        filterTemplateData.templateFilter.country,
      );
      expect(filterTemplate.yearOfExperience).toEqual(
        filterTemplateData.templateFilter.yearOfExperience,
      );
      expect(filterTemplate.level).toEqual(
        filterTemplateData.templateFilter.level,
      );
    });
  });

  describe('PUT /filter-templates/:companyId/filters/:filterId - update filter templates for company', () => {
    it('returns company with one filter template', async () => {
      const filterTemplateToUpdate = await (
        await createFilterTemplateInCompany(companyModel, companyId)
      ).filterTemplates[0];

      const updateFilterTemplateData = {
        templateFilter: {
          country: 'Poland',
          yearOfExperience: '<1',
          level: 'Junior',
        },
        templateFilterConfig: {
          name: 'Test template filter',
          pointColor: '#123456',
          pointShape: 'circle',
        },
      };

      const { body } = await request(app.getHttpServer())
        .put(
          `/filter-templates/${companyId}/filters/${filterTemplateToUpdate._id.toString()}`,
        )
        .send(updateFilterTemplateData)
        .expect(200);

      const filterTemplate = body[0];

      expect(filterTemplate._id.toString()).toBeDefined();
      expect(filterTemplate.name).toEqual(
        updateFilterTemplateData.templateFilterConfig.name,
      );
      expect(filterTemplate.pointColor).toEqual(
        updateFilterTemplateData.templateFilterConfig.pointColor,
      );
      expect(filterTemplate.pointShape).toEqual(
        updateFilterTemplateData.templateFilterConfig.pointShape,
      );
      expect(filterTemplate.country).toEqual(
        updateFilterTemplateData.templateFilter.country,
      );
      expect(filterTemplate.yearOfExperience).toEqual(
        updateFilterTemplateData.templateFilter.yearOfExperience,
      );
      expect(filterTemplate.level).toEqual(
        updateFilterTemplateData.templateFilter.level,
      );
    });
  });

  describe('DELETE /filter-templates/:companyId/filters/:filterId - removes filter by id', () => {
    it('returns company wthout removed filter template', async () => {
      const newFilterTemplate = await (
        await createFilterTemplateInCompany(companyModel, companyId)
      ).filterTemplates[0];

      const { body } = await request(app.getHttpServer())
        .delete(
          `/filter-templates/${companyId}/filters/${newFilterTemplate._id.toString()}`,
        )
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });
  });

  describe('GET /filter-templates/:companyId/teams/:teamId/filters - get filter templates for team', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${companyId}/teams/${teamId}/filters`)
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one filter template', async () => {
      const companyWithFilterTemplateInTeam = await createFilterTemplateInTeam(
        companyModel,
        companyId,
        teamId,
      );

      const filterTemplates =
        companyWithFilterTemplateInTeam.teams[0].filterTemplates;

      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${companyId}/teams/${teamId}/filters`)
        .expect(200);

      expect(body.length).toBe(1);
      expect(body).toEqual([filterTemplates[0]]);
    });
  });

  describe('POST /filter-templates/:companyId/teams/:teamId/filters - add filter template to team', () => {
    it('returns team with new filter template', async () => {
      const filterTemplateData = {
        templateFilter: {
          country: 'Austria',
        },
        templateFilterConfig: {
          name: 'Test template filter',
          pointColor: '#431423',
          pointShape: 'triangle',
        },
      };

      const { body } = await request(app.getHttpServer())
        .post(`/filter-templates/${companyId}/teams/${teamId}/filters`)
        .send(filterTemplateData)
        .expect(201);

      expect(body._id).toBeDefined();
      expect(body.filterTemplates.length).toBe(1);

      const filterTemplate = body.filterTemplates[0];

      expect(filterTemplate.country).toEqual(
        filterTemplateData.templateFilter.country,
      );
      expect(filterTemplate.name).toEqual(
        filterTemplateData.templateFilterConfig.name,
      );
      expect(filterTemplate.pointColor).toEqual(
        filterTemplateData.templateFilterConfig.pointColor,
      );
      expect(filterTemplate.pointShape).toEqual(
        filterTemplateData.templateFilterConfig.pointShape,
      );
    });
  });

  describe('PUT /filter-templates/:companyId/teams/:teamId/filters/:filterId - update filter template by id in team', () => {
    it('returns team with new filter template', async () => {
      const filterTemplate = (
        await createFilterTemplateInTeam(companyModel, companyId, teamId)
      ).teams[0].filterTemplates[0];

      const updateFilterTemplateData = {
        templateFilter: {
          country: 'Germany',
        },
        templateFilterConfig: {
          name: 'Test template filter - updated',
          pointColor: '#123321',
          pointShape: 'square',
        },
      };

      const { body } = await request(app.getHttpServer())
        .put(
          `/filter-templates/${companyId}/teams/${teamId}/filters/${filterTemplate._id.toString()}`,
        )
        .send(updateFilterTemplateData)
        .expect(200);

      const updatedFilterTemplate = body.filterTemplates[0];

      expect(body._id).toBeDefined();
      expect(body.filterTemplates.length).toBe(1);

      expect(updatedFilterTemplate.country).toEqual(
        updateFilterTemplateData.templateFilter.country,
      );
      expect(updatedFilterTemplate.name).toEqual(
        updateFilterTemplateData.templateFilterConfig.name,
      );
      expect(updatedFilterTemplate.pointColor).toEqual(
        updateFilterTemplateData.templateFilterConfig.pointColor,
      );
      expect(updatedFilterTemplate.pointShape).toEqual(
        updateFilterTemplateData.templateFilterConfig.pointShape,
      );
    });
  });

  describe('DELETE /filter-templates/:companyId/teams/:teamId/filters/:filterId - remove filter template by id from team', () => {
    it('returns team without removed filter template', async () => {
      const filterTemplate = (
        await createFilterTemplateInTeam(companyModel, companyId, teamId)
      ).teams[0].filterTemplates[0];

      const { body } = await request(app.getHttpServer())
        .delete(
          `/filter-templates/${companyId}/teams/${teamId}/filters/${filterTemplate._id.toString()}`,
        )
        .expect(200);

      expect(body.filterTemplates.length).toBe(0);
      expect(body.filterTemplates).toEqual([]);
    });
  });
});
