import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Filter } from 'src/filter/models/filter.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';

const createFilter = async (filterModel: Model<Filter>): Promise<Filter> => {
  const filterData = {
    name: 'Test filter',
    filterPath: 'testFilter',
  } as Partial<Filter>;
  return await (await filterModel.create(filterData)).save();
};

describe('FilterController', () => {
  let app: INestApplication;
  let filterModel: Model<Filter>;

  beforeEach(async () => {
    app = await getApplication();
    filterModel = app.get(getModelToken(Filter.name));
  });

  describe('GET /filters - get all filters', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/filters')
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });

    it('returns array with one filter', async () => {
      const filter = await createFilter(filterModel);

      const { body } = await request(app.getHttpServer())
        .get('/filters')
        .expect(200);

      expect(body.length).toBe(1);
      expect(body).not.toEqual([]);

      const { filterPath, name, values, _id } = body[0];

      expect(filterPath).toEqual(filter.filterPath);
      expect(name).toEqual(filter.name);
      expect(values).toEqual([]);
      expect(_id.toString()).toEqual(filter._id.toString());
    });
  });

  describe('GET /filters/:filterId - get filter by id', () => {
    it('returns filter by given id', async () => {
      const filter = await createFilter(filterModel);

      const { body } = await request(app.getHttpServer())
        .get(`/filters/${filter._id.toString()}`)
        .expect(200);

      const { filterPath, name, values, _id } = body;

      expect(filterPath).toEqual(filter.filterPath);
      expect(name).toEqual(filter.name);
      expect(values).toEqual([]);
      expect(_id.toString()).toEqual(filter._id.toString());
    });
  });

  describe('POST /filters - create new filter', () => {
    it('returns new filter', async () => {
      const filterData = {
        name: 'Test filter',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/filters`)
        .send(filterData)
        .expect(201);

      const { filterPath, name, values, _id } = body;

      expect(filterPath).toEqual('testFilter');
      expect(name).toEqual(filterData.name);
      expect(values).toEqual([]);
      expect(_id.toString()).toBeDefined();
    });
  });
});
