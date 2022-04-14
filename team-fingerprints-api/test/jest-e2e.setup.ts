import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/role/models/role.model';
import { User } from 'src/users/models/user.model';
import { createBaseUser, giveSuperAdminPrivileges } from './helpers/users';
import { getApplication } from './helpers/getApplication';
import { getMongoConnection } from './helpers/getMongoConnection';

jest.mock('cache-manager-redis-store');
jest.mock('cache-manager');

let usersModel: Model<User>;
let roleModel: Model<Role>;
let baseUser: User;

jest.setTimeout(40000);

beforeEach(async () => {
  jest.setTimeout(20000);
  const conn = await getMongoConnection();
  await conn.dropDatabase();

  const app = await getApplication();
  usersModel = app.get(getModelToken(User.name));
  roleModel = app.get(getModelToken(Role.name));
  baseUser = await createBaseUser(usersModel);
  await giveSuperAdminPrivileges(roleModel, baseUser);
});

afterAll(async () => {
  const conn = await getMongoConnection();
  await conn.dropDatabase();
  await conn.close();

  const app = await getApplication();
  await app.close();
});
