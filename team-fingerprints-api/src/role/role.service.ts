import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Role } from './role.type';

@Injectable()
export class RoleService {
  constructor(@InjectModel(User.name) private readonly User: Model<User>) {}

  async changeUserRole(userId: string, role: Role) {
    if (role.toString() in Role) {
      return await this.User.findOneAndUpdate(
        { _id: userId },
        { role },
        { new: true },
      );
    }
    throw new BadRequestException();
  }
}
