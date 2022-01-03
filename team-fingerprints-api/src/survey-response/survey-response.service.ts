import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { SurveySummarizeService } from 'src/survey-summarize/survey-summarize.service';
import { User } from 'src/users/entities/user.entity';
import { QuestionResponseDto } from './dto/QuestionResponseDto.dto';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly surveySummarizeService: SurveySummarizeService,
  ) {}

  async getUserAnswers(userId: string, surveyId: string) {
    // await this.surveySummarizeService.countPoints(userId, surveyId);
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
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      let survey = await this.getUserAnswers(userId, surveyId);

      if (!survey) {
        await this.userModel
          .updateOne(
            { _id: userId },
            {
              $push: {
                surveysResponses: { questionResponseData, surveyId },
              },
            },
          )
          .session(session)
          .exec();
        survey = await this.getUserAnswers(userId, surveyId);
      }

      const [surveyResponses] = survey.surveysResponses;
      if (
        surveyResponses.responses.find(
          (el) => el.questionId === questionResponseData.questionId,
        )
      ) {
        throw new BadRequestException(
          'Can not answer more than once per question',
        );
      }

      const newAnswer = await this.userModel
        .updateOne(
          { _id: userId, 'surveysResponses.surveyId': surveyId },
          {
            $push: {
              'surveysResponses.$.responses': questionResponseData,
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
          { _id: userId, 'surveysResponses.surveyId': surveyId },
          {
            $inc: { 'surveysResponses.$.amountOfAnswers': 1 },
          },
        )
        .session(session)
        .exec();
      return newAnswer;
    });
    session.endSession();
  }
}
