import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { QuestionResponseDto } from './dto/QuestionResponseDto.dto';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserAnswers(userId: string, surveyId: string) {
    return await this.userModel
      .findOne(
        { _id: userId, 'surveysResponses.surveyId': surveyId },
        {
          'surveysResponses.$': 1,
        },
      )
      .exec();
  }

  async saveUserSurveyRespone(
    userId: string,
    surveyId: string,
    questionResponseData: QuestionResponseDto,
  ) {
    let survey = await this.getUserAnswers(userId, surveyId);

    if (!survey) {
      await this.userModel.updateOne(
        { _id: userId },
        {
          $push: {
            surveysResponses: { questionResponseData, surveyId },
          },
        },
      );
      survey = await this.getUserAnswers(userId, surveyId);
    }

    const [aaa] = survey.surveysResponses;
    if (
      !aaa.responses.find(
        (el) => el.questionId === questionResponseData.questionId,
      )
    ) {
      return await this.userModel.updateOne(
        { _id: userId, 'surveysResponses.surveyId': surveyId },
        {
          $push: {
            'surveysResponses.$.responses': questionResponseData,
          },
        },
      );
    }

    return new BadRequestException(
      'Can not answer more than once per question',
    );
  }
}