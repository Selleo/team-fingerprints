import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { User } from './entities/user.entity';

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
    return await this.userModel.findOne({ _id: userId });
  }

  async getUsersAll(): Promise<User[]> {
    return await this.userModel.find({});
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
}
