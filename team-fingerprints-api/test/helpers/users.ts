import { Model } from 'mongoose';
import { RoleI } from 'src/role/interfaces/role.interface';
import { Role } from 'src/role/models/role.model';
import { RoleType } from 'src/role/role.type';
import { User } from 'src/users/models/user.model';
import { createUser } from '../../test/factories/user.factory';
import { create } from './create';
import { baseUserData } from './data/baseUserData';

export async function createBaseUser<T extends User>(userModel: Model<T>) {
  const user = await create(User, baseUserData());
  const newUser: User = await userModel.create(user);
  return newUser.save();
}

export async function createRandomUser<T extends User>(userModel: Model<T>) {
  const user = await create(User, await createUser());
  const newUser: User = await userModel.create(user);
  return newUser.save();
}

export async function giveSuperAdminPrivileges<T extends Role>(
  roleModel: Model<T>,
  { _id, email }: Partial<User>,
) {
  const roleDocumentData: Partial<RoleI> = {
    userId: _id.toString(),
    email,
    role: RoleType.SUPER_ADMIN,
  };

  const newRoleDocument = await roleModel.create(roleDocumentData);
  return await newRoleDocument.save();
}
