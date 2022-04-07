import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model } from 'mongoose';
import { Role } from 'src/role/models/role.model';
import { getModelToken } from '@nestjs/mongoose';
import { RoleType } from 'src/role/role.type';

describe('RoleController', () => {
  let app: INestApplication;
  let roleModel: Model<Role>;

  beforeEach(async () => {
    app = await getApplication();
    roleModel = app.get(getModelToken(Role.name));
  });

  describe('POST /role/superadmin - add super admin role by email', () => {
    it('terurns new super admin role document', async () => {
      const email = 'kinnyzimmer@gmail.com';

      const { body } = await request(app.getHttpServer())
        .post('/role/superAdmin')
        .send({ email })
        .expect(201);

      const roleDocument = await roleModel.findOne({
        email,
        role: RoleType.SUPER_ADMIN,
      });

      expect(body.email).toEqual(email);
      expect(body.email).toEqual(roleDocument.email);
      expect(body.role).toEqual(roleDocument.role);
    });
  });
});
