import { INestApplication } from '@nestjs/common';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { Model, Types } from 'mongoose';
import { RoleModel } from 'src/role/models/role.model';
import { getModelToken } from '@nestjs/mongoose';
import { RoleType } from 'team-fingerprints-common';
import { UserModel } from 'src/users/models/user.model';
import { getBaseUser } from './helpers/getBaseUser';
import { createRandomUser } from './helpers/users';

describe('RoleController', () => {
  let app: INestApplication;
  let roleModel: Model<RoleModel>;
  let userModel: Model<UserModel>;
  let baseUser: UserModel;

  beforeEach(async () => {
    app = await getApplication();
    roleModel = app.get(getModelToken(RoleModel.name));
    userModel = app.get(getModelToken(UserModel.name));
    baseUser = await getBaseUser(userModel);
  });

  describe('POST /role/superadmin - add super admin role by email', () => {
    it('terurns new super admin role document', async () => {
      const email = 'kinnyzimmer123@gmail.com';

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

  describe('DELETE /role/:roleId/leave - leave company/team by removing role', () => {
    it('terurns removed role', async () => {
      const teamId = new Types.ObjectId().toString();
      const companyId = new Types.ObjectId().toString();

      const userRoleDocument = await (
        await roleModel.create({
          role: RoleType.USER,
          teamId,
          companyId,
          userId: baseUser._id.toString(),
          email: baseUser.email,
        })
      ).save();

      const { body } = await request(app.getHttpServer())
        .delete(`/role/${userRoleDocument._id.toString()}/leave`)
        .expect(200);

      const roleDocument = await roleModel.findById(
        userRoleDocument._id.toString(),
      );

      expect(roleDocument).toBeNull();
      expect(body.email).toEqual(baseUser.email);
      expect(body.role).toEqual(RoleType.USER);
      expect(body.companyId).toEqual(companyId);
      expect(body.teamId).toEqual(teamId);
    });
  });

  describe('DELETE /role/:roleId/remove - rmove user from company/team by removing role', () => {
    it('terurns removed role', async () => {
      const randomUser = await createRandomUser(userModel);

      const teamId = new Types.ObjectId().toString();
      const companyId = new Types.ObjectId().toString();

      const userRoleDocument = await (
        await roleModel.create({
          role: RoleType.USER,
          teamId,
          companyId,
          userId: randomUser._id.toString(),
          email: randomUser.email,
        })
      ).save();

      const { body } = await request(app.getHttpServer())
        .delete(`/role/${userRoleDocument._id.toString()}/remove`)
        .expect(200);

      const roleDocument = await roleModel.findById(
        userRoleDocument._id.toString(),
      );

      expect(roleDocument).toBeNull();
      expect(body.email).toEqual(randomUser.email);
      expect(body.role).toEqual(RoleType.USER);
      expect(body.companyId).toEqual(companyId);
      expect(body.teamId).toEqual(teamId);
    });
  });
});
