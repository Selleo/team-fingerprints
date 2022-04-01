import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { baseUserData } from './data/baseUserData';

export async function getBaseUser(userModel: Model<User>) {
  return await userModel.findOne({ email: baseUserData().email });
}
