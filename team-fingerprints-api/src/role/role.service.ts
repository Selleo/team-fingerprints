import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Role } from './role.type';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async changeUserRole(userId: string, role: Role) {
    if (role.toString() in Role) {
      return await this.userModel.findOneAndUpdate(
        { _id: userId },
        { role },
        { new: true },
      );
    }
    return new BadRequestException();
  }
}
