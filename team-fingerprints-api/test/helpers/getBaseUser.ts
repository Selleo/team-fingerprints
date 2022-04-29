import { Model } from 'mongoose';
import { UserModel } from 'src/users/models/user.model';
import { baseUserData } from './data/baseUserData';

export async function getBaseUser(userModel: Model<UserModel>) {
  return await userModel.findOne({ email: baseUserData().email });
}
