import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Role } from './models/role.model';
import { RoleType } from './role.type';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async changeUserRole(userId: string, role: RoleType) {
    if (role.toString() in RoleType) {
      return await this.userModel.findOneAndUpdate(
        { _id: userId },
        { role },
        { new: true },
      );
    }
    throw new BadRequestException();
  }

  async createRoleDocument(userId: string): Promise<Role> {
    return await this.roleModel.create({ userId });
  }
}
