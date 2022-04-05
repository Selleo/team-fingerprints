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
    name: 'Test team',
    pointColor: '#fffaaa',
    pointShape: 'square',
  };

  const companyData = {
    name: 'Test company',
    pointColor: '#fffaaa',
    pointShape: 'square',
    teams: [teamData],
    domain: 'example.com',
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
    templateFilter: {
      country: 'Poland',
    },
    templateFilterConfig: {
      name: 'Test template filter',
      pointColor: '#123456',
      pointShape: 'circle',
    },
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

  describe('GET /filter-template - get filter templates for company', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/filter-template/${company._id.toString()}`)
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one filter template', async () => {
      const companyWithTemplate = await createFilterTemplateInCompany(
        companyModel,
        company._id.toString(),
      );

      const { body } = await request(app.getHttpServer())
        .get(`/filter-template/${company._id.toString()}`)
        .expect(200);

      expect(body.length).toBe(1);
      expect(body).toEqual(companyWithTemplate.filterTemplates);
    });
  });
});
