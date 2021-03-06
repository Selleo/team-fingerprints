import faker from '@faker-js/faker';
import * as mongoose from 'mongoose';
import { UserModel } from 'src/users/models/user.model';
import { create } from '../helpers/create';
import { Factory } from 'rosie';

Factory.define<UserModel>(UserModel.name).attrs({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  authId: `google-auth2|${new mongoose.Types.ObjectId().toString()}`,
});

export async function createUser<User>(domain = 'gmail.com') {
  let attrs: Partial<User>;
  const email = `${faker.random.alphaNumeric(10)}@${domain}`;

  return await create(UserModel, { ...attrs, email });
}
