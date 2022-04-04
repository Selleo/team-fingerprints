import { INestApplication } from '@nestjs/common';
import { Filter } from 'src/filter/models/filter.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { CreateFilterValueDto } from 'src/filter/dto/filter';

const createFilter = async (): Promise<Filter> => {
  const filterData = {
    name: 'Test filter',
  } as Partial<Filter>;
  const app = await getApplication();
  const { body } = await request(app.getHttpServer())
    .post('/filters')
    .send(filterData);

  return body;
};

describe('FilterController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await getApplication();
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
      const filter = await createFilter();

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
      const filter = await createFilter();

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

  describe('PATCH /filters/:filterId - update filter', () => {
    it('returns updated filter', async () => {
      const filter = await createFilter();

      const filterUpdateData = {
        name: 'Test Filter Updated',
      };

      const { body } = await request(app.getHttpServer())
        .patch(`/filters/${filter._id.toString()}`)
        .send(filterUpdateData)
        .expect(200);

      const { filterPath, name, values, _id } = body;

      expect(filterPath).toEqual('testFilterUpdated');
      expect(name).toEqual(filterUpdateData.name);
      expect(values).toEqual([]);
      expect(_id.toString()).toEqual(filter._id.toString());
    });
  });

  describe('DELETE /filters/:filterId - remove filter', () => {
    it('returns removed filter', async () => {
      const filter = await createFilter();

      const { body } = await request(app.getHttpServer())
        .delete(`/filters/${filter._id.toString()}`)
        .expect(200);

      const { filterPath, name, values, _id } = body;

      expect(filterPath).toEqual('testFilter');
      expect(name).toEqual(filter.name);
      expect(values).toEqual([]);
      expect(_id.toString()).toEqual(filter._id.toString());
    });
  });

  describe('GET /filters/:filterId/values - get filter values', () => {
    it('returns empty array', async () => {
      const filter = await createFilter();

      const { body } = await request(app.getHttpServer())
        .get(`/filters/${filter._id.toString()}/values`)
        .expect(200);

      expect(body.values.length).toBe(0);
      expect(body.values).toEqual([]);
    });
  });

  describe('POST /filters/:filterId/values - add filter value', () => {
    it('returns filter', async () => {
      const filter = await createFilter();

      const filterValueData: CreateFilterValueDto = {
        value: 'Test value',
      };

      const { body } = await request(app.getHttpServer())
        .post(`/filters/${filter._id.toString()}/values`)
        .send(filterValueData)
        .expect(201);

      const { values } = body;

      expect(values.length).toBe(1);
      expect(values).not.toEqual([]);
      expect(values[0].value).toEqual(filterValueData.value);
      expect(values[0]._id.toString()).toBeDefined();
    });
  });

  describe('PATCH /filters/:filterId/values/:valueId - update filter value', () => {
    it('returns filter with updated value', async () => {
      const filter = await createFilter();

      const filterValueData: CreateFilterValueDto = {
        value: 'Test value',
      };

      const updateFilterValueData: CreateFilterValueDto = {
        value: 'Test value - updated',
      };

      const res = await request(app.getHttpServer())
        .post(`/filters/${filter._id.toString()}/values`)
        .send(filterValueData)
        .expect(201);

      const valueId = res.body.values[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .patch(`/filters/${filter._id.toString()}/values/${valueId}`)
        .send(updateFilterValueData)
        .expect(200);

      const { values } = body;

      expect(values.length).toBe(1);
      expect(values).not.toEqual([]);
      expect(values[0].value).toEqual(updateFilterValueData.value);
      expect(values[0]._id.toString()).toBeDefined();
    });
  });

  describe('DELETE /filters/:filterId/values/:valueId - remove filter value', () => {
    it('returns filter without removed value', async () => {
      const filter = await createFilter();

      const filterValueData: CreateFilterValueDto = {
        value: 'Test value',
      };

      const res = await request(app.getHttpServer())
        .post(`/filters/${filter._id.toString()}/values`)
        .send(filterValueData)
        .expect(201);

      const valueId = res.body.values[0]._id.toString();

      const { body } = await request(app.getHttpServer())
        .delete(`/filters/${filter._id.toString()}/values/${valueId}`)
        .expect(200);

      const { values } = body;

      expect(values.length).toBe(0);
      expect(values).toEqual([]);
    });
  });
});
