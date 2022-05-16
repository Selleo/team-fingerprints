import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyModel } from 'src/company/models/company.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { createSurvey, surveyData } from './survey-result-filter.setup';
import { SurveyModel } from 'src/survey/models/survey.model';

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

const filterTemplateDataForCompany = {
  _id: new Types.ObjectId().toString(),
  name: 'Test template filter',
  visible: true,
  pointColor: '#123456',
  pointShape: 'circle',
  filters: {
    country: 'Croatia',
  },
};

const filterTemplateDataForTeam = {
  _id: new Types.ObjectId().toString(),
  name: 'Test template filter',
  visible: true,
  pointColor: '#abcdef',
  pointShape: 'square',
  filters: {
    country: 'Slovakia',
  },
};

const createFilterTemplateInCompany = async (
  companyModel: Model<CompanyModel>,
  companyId: string,
  surveyId: string,
  filterTemplateData: any,
) => {
  return await companyModel.findOneAndUpdate(
    { _id: companyId },
    {
      $push: {
        filterTemplates: { ...filterTemplateData, surveyId },
      },
    },
    { new: true },
  );
};

const createFilterTemplateInTeam = async (
  companyModel: Model<CompanyModel>,
  companyId: string,
  teamId: string,
  surveyId: string,
  filterTemplateData: any,
) => {
  return await companyModel.findByIdAndUpdate(
    { _id: companyId },
    {
      $push: {
        'teams.$[team].filterTemplates': { ...filterTemplateData, surveyId },
      },
    },
    { arrayFilters: [{ 'team._id': teamId }], new: true },
  );
};

describe('FilterTemplateController', () => {
  let app: INestApplication;
  let companyModel: Model<CompanyModel>;
  let company: CompanyModel;
  let surveyModel: Model<SurveyModel>;
  let companyId: string;
  let teamId: string;
  let survey: Partial<SurveyModel>;
  let surveyId: string;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(CompanyModel.name));
    surveyModel = app.get(getModelToken(SurveyModel.name));
    company = await createCompanyWithTeam(companyModel);
    companyId = company._id.toString();
    teamId = company.teams[0]._id.toString();
    survey = await createSurvey(surveyModel, surveyData);
    surveyId = survey._id.toString();
  });

  describe('GET /:surveyId/companies/:companyId/filters - get filter templates for company and given surveyId', () => {
    it('returns filter templates that matches companyId and surveyId', async () => {
      await createFilterTemplateInCompany(
        companyModel,
        companyId,
        surveyId,
        filterTemplateDataForCompany,
      );

      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${surveyId}/companies/${companyId}/filters`)
        .expect(200);

      expect(body[0]).toMatchObject({
        ...filterTemplateDataForCompany,
        surveyId,
      });
    });
  });

  describe('POST /:surveyId/companies/:companyId/filters - create new filter template for company', () => {
    it('creates and returns new filter template', async () => {
      const newFilterTemplate = {
        filters: {
          country: 'PL',
        },
        surveyId,
        name: 'Test template',
        pointColor: '#5d54aa',
        pointShape: 'circle',
        visible: true,
      };

      const { body } = await request(app.getHttpServer())
        .post(`/filter-templates/${surveyId}/companies/${companyId}/filters`)
        .send(newFilterTemplate)
        .expect(201);

      const { filterTemplates } = body;

      expect(filterTemplates[0]).toMatchObject(newFilterTemplate);
      expect(filterTemplates[0]._id).toBeDefined();
    });
  });

  describe('PUT /:surveyId/companies/:companyId/filters/:filterId - update existing filter template', () => {
    it('returns updated filter template', async () => {
      const existingFilterTemplate = await createFilterTemplateInCompany(
        companyModel,
        companyId,
        surveyId,
        filterTemplateDataForCompany,
      );

      const updateFilterTemplate = {
        ...filterTemplateDataForCompany,
        name: 'updated',
        pointShape: 'square',
        filters: {
          country: 'USA',
        },
      };

      const { body } = await request(app.getHttpServer())
        .put(
          `/filter-templates/${surveyId}/companies/${companyId}/filters/${existingFilterTemplate.filterTemplates[0]._id.toString()}`,
        )
        .send(updateFilterTemplate)
        .expect(200);

      expect(body[0]).toMatchObject(updateFilterTemplate);
    });
  });

  describe('DELETE /:surveyId/companies/:companyId/filters/:filterId - remove filter template by id', () => {
    it('removes and returns removed filter templaye, by id', async () => {
      const existingFilterTemplate = await createFilterTemplateInCompany(
        companyModel,
        companyId,
        surveyId,
        filterTemplateDataForCompany,
      );

      const { body } = await request(app.getHttpServer())
        .delete(
          `/filter-templates/${surveyId}/companies/${companyId}/filters/${existingFilterTemplate.filterTemplates[0]._id.toString()}`,
        )
        .expect(200);

      expect(body[0]).toMatchObject(filterTemplateDataForCompany);
    });
  });

  describe('GET /:surveyId/companies/:companyId/teams/:teamId/filters/:filterId - get filter templates for team and given surveyId', () => {
    it('removes and returns removed filter templaye, by id', async () => {
      await createFilterTemplateInTeam(
        companyModel,
        companyId,
        teamId,
        surveyId,
        filterTemplateDataForTeam,
      );

      const { body } = await request(app.getHttpServer())
        .get(
          `/filter-templates/${surveyId}/companies/${companyId}/teams/${teamId}/filters`,
        )
        .expect(200);

      expect(body[0]).toMatchObject({ ...filterTemplateDataForTeam, surveyId });
    });
  });

  describe('POST /:surveyId/companies/:companyId/teams/:teamId/filters - create new filter template for team', () => {
    it('creates and returns new filter template', async () => {
      const newFilterTemplate = {
        filters: {
          country: 'PL',
        },
        surveyId,
        name: 'Test template',
        pointColor: '#5d54aa',
        pointShape: 'circle',
        visible: true,
      };

      const { body } = await request(app.getHttpServer())
        .post(
          `/filter-templates/${surveyId}/companies/${companyId}/teams/${teamId}/filters`,
        )
        .send(newFilterTemplate)
        .expect(201);

      const { filterTemplates } = body;

      expect(filterTemplates[0]).toMatchObject(newFilterTemplate);
      expect(filterTemplates[0]._id).toBeDefined();
    });
  });

  describe('PUT /:surveyId/companies/:companyId/teams/:teamId/filters/:filterId - update existing filter template', () => {
    it('returns updated filter template', async () => {
      const existingFilterTemplate = await createFilterTemplateInTeam(
        companyModel,
        companyId,
        teamId,
        surveyId,
        filterTemplateDataForTeam,
      );

      const updateFilterTemplate = {
        ...filterTemplateDataForTeam,
        name: 'updated',
        pointShape: 'square',
        filters: {
          country: 'USA',
        },
      };

      const { body } = await request(app.getHttpServer())
        .put(
          `/filter-templates/${surveyId}/companies/${companyId}/teams/${teamId}/filters/${existingFilterTemplate.teams[0].filterTemplates[0]._id.toString()}`,
        )
        .send(updateFilterTemplate)
        .expect(200);

      expect(body.filterTemplates[0]).toMatchObject(updateFilterTemplate);
    });
  });

  describe('DELETE /:surveyId/companies/:companyId/teams/:teamId/filters/:filterId - remove filter template by id', () => {
    it('removes and returns removed filter templaye, by id', async () => {
      const existingFilterTemplate = await createFilterTemplateInTeam(
        companyModel,
        companyId,
        teamId,
        surveyId,
        filterTemplateDataForTeam,
      );

      const { body } = await request(app.getHttpServer())
        .delete(
          `/filter-templates/${surveyId}/companies/${companyId}/teams/${teamId}/filters/${existingFilterTemplate.teams[0].filterTemplates[0]._id.toString()}`,
        )
        .expect(200);

      expect(body.filterTemplates[0]).toMatchObject(filterTemplateDataForTeam);
    });
  });
});
