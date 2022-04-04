import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Filter } from 'src/filter/models/filter.model';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';

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
  });
});
