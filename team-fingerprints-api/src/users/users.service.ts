import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { UserSurveyResponseDto } from './dto/UserSurveyResponseDto.dto ';
import { User } from './entities/user.entity';
import { UserRole } from './Roles/UserRoles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUser(userId: string): Promise<User> {
    return await this.userModel.findOne({ _id: userId });
  }

  async getUsersAll(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async createUser(newUserData: CreateUserDto): Promise<User> {
    return await this.userModel.create(newUserData);
  }

  async updateUser(userId: string, updateUserData: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: userId }, { updateUserData });
  }

  async removeUser(userId: string) {
    return await this.userModel.deleteOne({ _id: userId });
  }

  async changeRole(userId: string, role: UserRole) {
    return await this.userModel.updateOne({ _id: userId }, { role });
  }

  async saveUsersSurveyRespone(
    userId: string,
    surveyResponseData: UserSurveyResponseDto,
  ) {
    return await this.userModel.create(
      { _id: userId },
      { $push: { surveysResponses: surveyResponseData } },
    );
  }
}
