import { Model } from 'mongoose';
import { Role, RoleType } from 'team-fingerprints-common';
import { UserModel } from 'src/users/models/user.model';
import { createUser } from '../../test/factories/user.factory';
import { create } from './create';
import { baseUserData } from './data/baseUserData';

export async function createBaseUser<T extends UserModel>(userModel: Model<T>) {
  const user = await create(UserModel, baseUserData());
  const newUser: UserModel = await userModel.create(user);
  return newUser.save();
}

export async function createRandomUser<T extends UserModel>(
  userModel: Model<T>,
) {
  const user = await create(UserModel, await createUser());
  const newUser: UserModel = await userModel.create(user);
  return newUser.save();
}

export async function giveSuperAdminPrivileges<T extends Role>(
  roleModel: Model<T>,
  { _id, email }: Partial<UserModel>,
) {
  const roleDocumentData: Partial<Role> = {
    userId: _id.toString(),
    email,
    role: RoleType.SUPER_ADMIN,
  };

  const newRoleDocument = await roleModel.create(roleDocumentData);
  return await newRoleDocument.save();
}
