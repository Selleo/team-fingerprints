import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { QuestionAnswerDto } from './dto/QuestionAnswerDto.dto';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getUserAnswers(userId: string, surveyId: string) {
    return await this.userModel
      .findOne(
        { _id: userId, 'surveysAnswers.surveyId': surveyId },
        {
          'surveysAnswers.$': 1,
        },
      )
      .exec();
  }

  private async changeAnswer(
    userId: string,
    surveyId: string,
    { value, questionId }: QuestionAnswerDto,
  ) {
    return await this.userModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            'surveysAnswers.$[survey].answers.$[question].value': value,
          },
        },
        {
          arrayFilters: [
            { 'survey.surveyId': surveyId },
            { 'question.questionId': questionId },
          ],
        },
      )
      .exec();
  }

  async saveUserSurveyAnswer(
    userId: string,
    surveyId: string,
    questionAnswerData: QuestionAnswerDto,
  ) {
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      let survey = await this.getUserAnswers(userId, surveyId);

      if (!survey) {
        await this.userModel
          .updateOne(
            { _id: userId },
            {
              $push: {
                surveysAnswers: { questionAnswerData, surveyId },
              },
            },
          )
          .session(session)
          .exec();
        survey = await this.getUserAnswers(userId, surveyId);
      }

      const [surveyAnswers] = survey?.surveysAnswers || [];

      if (
        surveyAnswers?.answers?.find?.(
          (el) => el.questionId === questionAnswerData.questionId,
        )
      ) {
        return this.changeAnswer(userId, surveyId, questionAnswerData);
      }

      const newAnswer = await this.userModel
        .updateOne(
          { _id: userId, 'surveysAnswers.surveyId': surveyId },
          {
            $push: {
              'surveysAnswers.$.answers': questionAnswerData,
            },
          },
        )
        .session(session)
        .exec();

      if (!newAnswer) {
        throw new InternalServerErrorException();
      }

      await this.userModel
        .updateOne(
          { _id: userId, 'surveysAnswers.surveyId': surveyId },
          {
            $inc: { 'surveysAnswers.$.amountOfAnswers': 1 },
          },
        )
        .session(session)
        .exec();
      return newAnswer;
    });
    session.endSession();
  }
}
