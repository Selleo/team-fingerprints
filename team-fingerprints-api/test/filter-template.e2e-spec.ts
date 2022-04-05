import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import { Filter } from 'src/filter/models/filter.model';
import * as request from 'supertest';
import { getApplication } from './helpers/getApplication';

const createCompanyWithTeam = async (
  companyModel: Model<Company>,
): Promise<Company> => {
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

const createFilterWithValue = async (
  filterModel: Model<Filter>,
): Promise<Filter> => {
  const values = [
    {
      _id: new Types.ObjectId(),
      value: 'Filter value 1',
    },
    {
      _id: new Types.ObjectId(),
      value: 'Filter value 2',
    },
  ];

  const filterData = {
    name: 'Test filter',
    filterPath: 'testFilter',
    values,
  };

  return await (await filterModel.create(filterData)).save();
};

const createFilterTemplateInCompany = async (
  companyModel: Model<Company>,
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
  companyModel: Model<Company>,
  companyId: string,
  teamId: string,
) => {
  const filterTemplateData = {
    templateFilter: {
      country: 'Slovakia',
    },
    templateFilterConfig: {
      name: 'Test template filter',
      pointColor: '#abcdef',
      pointShape: 'square',
    },
  };

  return await companyModel.findOne(
    { _id: companyId, 'teams._id': teamId },
    {
      $put: { ' teams.$.filterTemplate': filterTemplateData },
    },
    { new: true },
  );
};

describe('FilterTemplateController', () => {
  let app: INestApplication;
  let companyModel: Model<Company>;
  let filterModel: Model<Filter>;
  let company: Company;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(Company.name));
    filterModel = app.get(getModelToken(Filter.name));
    company = await createCompanyWithTeam(companyModel);
  });

  describe('GET /filter-templates/:companyId/filters - get filter templates for company', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${company._id.toString()}/filters`)
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one filter template', async () => {
      await createFilterTemplateInCompany(companyModel, company._id.toString());

      const { body } = await request(app.getHttpServer())
        .get(`/filter-templates/${company._id.toString()}/filters`)
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
        .post(`/filter-templates/${company._id.toString()}/filters`)
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
        await createFilterTemplateInCompany(
          companyModel,
          company._id.toString(),
        )
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
          `/filter-templates/${company._id.toString()}/filters/${filterTemplateToUpdate._id.toString()}`,
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
        await createFilterTemplateInCompany(
          companyModel,
          company._id.toString(),
        )
      ).filterTemplates[0];

      const { body } = await request(app.getHttpServer())
        .delete(
          `/filter-templates/${company._id.toString()}/filters/${newFilterTemplate._id.toString()}`,
        )
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });
  });
});
