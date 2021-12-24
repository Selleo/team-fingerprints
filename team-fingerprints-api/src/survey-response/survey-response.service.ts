import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UserSurveyResponseDto } from './dto/UserSurveyResponseDto.dto ';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async saveUsersSurveyRespone(
    userId: string,
    surveyResponseData: UserSurveyResponseDto,
  ) {
    return await this.userModel.updateOne(
      { _id: userId },
      { $push: { surveysResponses: surveyResponseData } },
    );
  }
}
