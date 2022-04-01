import { INestApplication } from '@nestjs/common';
import { createUser } from './factories';
import { getApplication } from './helpers/getApplication';
import * as request from 'supertest';
import { baseUserData } from './helpers/data/baseUserData';
import { RoleType } from 'src/role/role.type';
import { Model } from 'mongoose';
import { Role } from 'src/role/models/role.model';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/models/user.model';
import { getBaseUser } from './helpers/getBaseUser';
import { UserDetailI } from 'src/users/interfaces/user.interface';
import { Filter } from 'src/filter/models/filter.model';
import * as mongoose from 'mongoose';
import { removeDocument } from './helpers/removeDocument';
import { UpdateUserDto } from 'src/users/dto/user.dto';

describe('UsersController', () => {
  let app: INestApplication;
  let baseUser: User;
  let roleModel: Model<Role>;
  let userModel: Model<User>;
  let filterModel: Model<Filter>;

  jest.setTimeout(20000);

  beforeEach(async () => {
    app = await getApplication();
    roleModel = app.get(getModelToken(Role.name));
    userModel = app.get(getModelToken(User.name));
    filterModel = app.get(getModelToken(Filter.name));
    baseUser = await getBaseUser(userModel);
  });

  describe('GET /users - returns curren user', () => {
    it('should return base user', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(body).toMatchObject(baseUserData());
    });
  });

  describe('GET /users/all - returns all users in system', () => {
    it('should return base user', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/all')
        .expect(200);

      expect(body[0]).toMatchObject(baseUserData());
      expect(body.length).toBe(1);
    });
  });

  describe('POST /users/profiles - returns profiles for given array of users ids', () => {
    it('should return profile for base user', async () => {
      const baseUserId = baseUser._id.toString();
      const { body } = await request(app.getHttpServer())
        .post('/users/profiles')
        .send([baseUserId])
        .expect(201);

      const role = await roleModel.findOne({
        userId: baseUserId,
        role: RoleType.SUPER_ADMIN,
      });

      expect(body.length).toBe(1);

      const { email, _id, privileges } = body[0];

      expect(email).toEqual(baseUserData().email);
      expect(_id).toEqual(baseUserId);
      expect(privileges.length).toBe(1);
      expect(privileges[0].role).toEqual(RoleType.SUPER_ADMIN);
      expect(privileges[0].roleId).toEqual(role._id.toString());
    });
  });

  describe('POST /users/details - sets user details for current user', () => {
    it('should throw - 404 Not Found', async () => {
      const userDetails: UserDetailI = {
        country: '324242323',
        yearOfExperience: '3423534',
      };
      await request(app.getHttpServer())
        .post('/users/details')
        .send(userDetails)
        .expect(404);
    });

    it('should return base user profile that includes user details', async () => {
      const newFiltersData = [
        {
          name: 'country',
          filterPath: 'country',
          values: [
            {
              value: 'Poland',
              _id: new mongoose.Types.ObjectId(),
            },
          ],
        },
        {
          name: 'Year of experience',
          filterPath: 'yearOfExperience',
          values: [
            {
              value: '<1',
              _id: new mongoose.Types.ObjectId(),
            },
          ],
        },
      ];

      const newFilters = await Promise.all(
        newFiltersData.map(async (filterData) => {
          return await (await filterModel.create(filterData)).save();
        }),
      );

      const userDetails: UserDetailI = {
        country: newFilters[0].values[0]._id.toString(),
        yearOfExperience: newFilters[1].values[0]._id.toString(),
      };

      const { body } = await request(app.getHttpServer())
        .post('/users/details')
        .send(userDetails)
        .expect(200);

      baseUser = await getBaseUser(userModel);
      const baseUserId = baseUser._id.toString();

      const role = await roleModel.findOne({
        userId: baseUserId,
        role: RoleType.SUPER_ADMIN,
      });

      const { email, _id, privileges } = body;

      expect(email).toEqual(baseUserData().email);
      expect(_id).toEqual(baseUserId);
      expect(body.userDetails.country).toEqual(userDetails.country);
      expect(body.userDetails.yearOfExperience).toEqual(
        userDetails.yearOfExperience,
      );
      expect(privileges.length).toBe(1);
      expect(privileges[0].role).toEqual(RoleType.SUPER_ADMIN);
      expect(privileges[0].roleId).toEqual(role._id.toString());
    });
  });

  describe('POST /users - creates new user', () => {
    it('should return new user', async () => {
      const user = await createUser('gmail.com');

      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send({ ...user })
        .expect(201);

      expect(body).toMatchObject({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authId: user.authId,
      });

      await removeDocument(userModel, user);
    });
  });

  describe('PATCH /users - updates current user', () => {
    it('should return updated user', async () => {
      const { firstName, lastName } = await createUser('gmail.com');

      const { body } = await request(app.getHttpServer())
        .patch('/users')
        .send({ firstName, lastName } as UpdateUserDto)
        .expect(200);

      expect(body).toMatchObject({
        email: baseUser.email,
        firstName,
        lastName,
        authId: baseUser.authId,
      });
    });
  });

  describe('Delete /users - removes user by email', () => {
    it('should return updated user', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/users')
        .send({ email: baseUser.email })
        .expect(200);

      const { _id, authId, email, firstName, lastName } = body;

      expect(_id.toString()).toBe(baseUser._id.toString());
      expect(authId).toBe(baseUser.authId);
      expect(email).toBe(baseUser.email);
      expect(firstName).toBe(baseUser.firstName);
      expect(lastName).toBe(baseUser.lastName);
    });
  });
});
