import { INestApplication } from '@nestjs/common';
import { createUser } from './factories';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { baseUserData } from './helpers/data/baseUserData';

const authToken = () => {
  return `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM0ZVVpMFVfdVlnYlpjbV9fSXBDYSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sbGt0ZTQxbS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDU5ODkyODA1NTgxNDkzOTIyMjIiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyIsImh0dHBzOi8vZGV2LWxsa3RlNDFtLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NDg3MjQ3MDQsImV4cCI6MTY0ODgxMTEwNCwiYXpwIjoiZ3FHWVFOaXM2SldmbXBkTlE1dG14Vlc5N1NHUHp6dmwiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.H5sUgI3UOp5YamYnHkjOrHhwcz4D2tZrR1ZdA9vCjCEy-W8uO0-HLD2E2BwImSA6Fo7KPybnb5M7Li9DHx9f9Vy7M69qtw3wGFGaBAOCXQWXqM1ye3PrljI7pOkgeOsmd_yHS9MdLyNrlZLeQOSZAT0OhPwzl9tQozAxthFdR20keswc8N2UgrmSDSEfCcPvW2apIkdrHQ9Et9_9F3MUg6Uonm_F4uJ4PgMdfV_4mQXwiX4xQFtyEV5IKBkdsyOmv0juIAhkY2nYrSSVB6irzHFKndfea3kExB1R8FW0Top-N8XeHPkuKKUDdfRqnUaa5EQ40aMQodcSDZdhqJNMLg`;
};

describe('UsersController', () => {
  let app: INestApplication;

  jest.setTimeout(20000);

  beforeAll(async () => {
    app = await getApplication();
  });

  beforeEach(async () => {
    app = await getApplication();
  });

  describe('GET /users', () => {
    it('should return empty array', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', authToken());
      expect(body).toMatchObject(baseUserData());
    });
  });

  describe('POST /users', () => {
    it('create and receive new user', async () => {
      const user = await createUser('gmail.com');

      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send({ ...user })
        .set('Authorization', authToken());

      expect(body).toMatchObject({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authId: user.authId,
      });
    });
  });
});
