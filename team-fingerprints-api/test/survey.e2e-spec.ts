import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { getApplication } from './helpers/getApplication';
import { getBaseUser } from './helpers/getBaseUser';
import * as request from 'supertest';

describe('SurveyController', () => {
  let app: INestApplication;
  let baseUser: User;
  let userModel: Model<User>;

  beforeEach(async () => {
    app = await getApplication();
    userModel = app.get(getModelToken(User.name));
    baseUser = await getBaseUser(userModel);
  });

  describe('GET /surveys - get survey with complete status for current user', () => {
    it('returns empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/surveys')
        .expect(200);

      expect(body.length).toBe(0);
      expect(body).toEqual([]);
    });
  });
});
