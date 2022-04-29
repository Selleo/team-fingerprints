import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RoleModel } from 'src/role/models/role.model';
import { UserModel } from 'src/users/models/user.model';
import { createBaseUser, giveSuperAdminPrivileges } from './helpers/users';
import { getApplication } from './helpers/getApplication';
import { getMongoConnection } from './helpers/getMongoConnection';

jest.mock('cache-manager-redis-store');
jest.mock('cache-manager');
jest.mock('bull');

let usersModel: Model<UserModel>;
let roleModel: Model<RoleModel>;
let baseUser: UserModel;
let connection: Connection;

jest.setTimeout(40000);

beforeAll(async () => {
  connection = await getMongoConnection();
});

beforeEach(async () => {
  jest.setTimeout(20000);
  await connection.dropDatabase();

  const app = await getApplication();
  usersModel = app.get(getModelToken(UserModel.name));
  roleModel = app.get(getModelToken(RoleModel.name));
  baseUser = await createBaseUser(usersModel);
  await giveSuperAdminPrivileges(roleModel, baseUser);
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.close();

  const app = await getApplication();
  await app.close();
});
