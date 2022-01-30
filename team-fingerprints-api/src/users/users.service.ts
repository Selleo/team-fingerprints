import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly User: Model<User>) {}

  async getUserByAuthId(authId: string): Promise<User> {
    return await this.User.findOne({ authId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.User.findOne({ email });
  }

  async getUser(userId: string): Promise<User> {
    return await this.User.findOne({ _id: userId });
  }

  async getUsersAll(): Promise<User[]> {
    return await this.User.find({});
  }

  async createUser(newUserData: CreateUserDto): Promise<User> {
    const user = await this.User.create(newUserData);
    return await user.save();
  }

  async updateUser(
    userId: string,
    updateUserData: UpdateUserDto,
  ): Promise<User> {
    return await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserData },
      { new: true },
    );
  }

  async removeUser(userId: string): Promise<User> {
    return await this.User.findOneAndDelete({ _id: userId });
  }
}
