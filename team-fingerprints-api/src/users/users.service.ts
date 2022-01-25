import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { User } from './entities/user.entity';
import { UserRole } from './user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserByAuthId(authId: string): Promise<User> {
    return await this.userModel.findOne({ authId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async getUser(userId: string): Promise<User> {
    return await this.userModel.findOne(
      { _id: userId },
      {
        _id: 1,
        url: 1,
        role: 1,
        email: 1,
        lastName: 1,
        firstName: 1,
      },
    );
  }

  async getUsersAll(): Promise<User[]> {
    return await this.userModel.find(
      {},
      {
        _id: 1,
        url: 1,
        role: 1,
        email: 1,
        lastName: 1,
        firstName: 1,
      },
    );
  }

  async createUser(newUserData: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(newUserData);
    return await user.save();
  }

  async updateUser(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserData },
      { new: true },
    );
  }

  async removeUser(userId: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ _id: userId });
  }

  async changeUserRole(userId: string, role: UserRole) {
    if (role.toString() in UserRole) {
      return await this.userModel.updateOne({ _id: userId }, { role });
    }
    return new BadRequestException();
  }
}
