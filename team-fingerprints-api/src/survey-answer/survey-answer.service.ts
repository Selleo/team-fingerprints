import {
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/models/user.model';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { SurveyCompleteStatus } from './survey-answer.type';
import { SurveySummarizeService } from 'src/survey-summarize/survey-summarize.service';
import { SurveyResultService } from 'src/survey-result/survey-result.service';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => SurveyResultService))
    private readonly surveyResultService: SurveyResultService,
    private readonly surveySummarizeService: SurveySummarizeService,
  ) {}

  async getUserAnswers(userId: string, surveyId: string): Promise<User> {
    return await this.User.findOne(
      { _id: userId, 'surveysAnswers.surveyId': surveyId },
      {
        'surveysAnswers.$': 1,
      },
    ).exec();
  }

  private async changeAnswer(
    userId: string,
    surveyId: string,
    { value, questionId }: QuestionAnswerDto,
  ): Promise<User | HttpException> {
    if (await this.checkIfSurveyIsFinished(userId, surveyId))
      throw new ForbiddenException();

    return await this.User.findOneAndUpdate(
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
        new: true,
      },
    ).exec();
  }

  async saveUserSurveyAnswer(
    userId: string,
    surveyId: string,
    questionAnswerData: QuestionAnswerDto,
  ) {
    if (await this.checkIfSurveyIsFinished(userId, surveyId))
      throw new ForbiddenException();

    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      let survey = await this.getUserAnswers(userId, surveyId);

      if (!survey) {
        await this.User.updateOne(
          { _id: userId },
          {
            $push: {
              surveysAnswers: {
                questionAnswerData,
                surveyId,
                completeStatus: SurveyCompleteStatus.PENDING,
              },
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

      const newAnswer = await this.User.updateOne(
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

      await this.User.updateOne(
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

  async saveCalculatedAnswers(userId: string, surveyId, data: unknown) {
    return await this.User.updateOne(
      { _id: userId },
      {
        $set: {
          'surveysAnswers.$[survey].surveyResult': data,
        },
      },
      {
        arrayFilters: [{ 'survey.surveyId': surveyId }],
      },
    ).exec();
  }

  async finishSurvey(userId: string, surveyId: string) {
    const isFinished = await this.checkIfSurveyIsFinished(userId, surveyId);
    if (isFinished)
      return await this.surveyResultService.getSurveyResultForUser(
        userId,
        surveyId,
      );
    await this.changeSurvayCompleteStatusToFinished(userId, surveyId);
    const calculatedAnswers =
      await this.surveySummarizeService.countPointsForUser(userId, surveyId);
    await this.saveCalculatedAnswers(userId, surveyId, calculatedAnswers);
    return await this.surveyResultService.getSurveyResultForUser(
      userId,
      surveyId,
    );
  }

  async checkIfSurveyIsFinished(userId: string, surveyId: string) {
    const userAnswersAll = await this.User.findOne({
      _id: userId,
      'surveysAnswers.surveyId': surveyId,
    }).exec();

    const userAnswers = userAnswersAll?.surveysAnswers?.find?.(
      (el) => el.surveyId === surveyId,
    );

    const result = userAnswers?.completeStatus;
    return result === SurveyCompleteStatus.FINISHED;
  }

  private async changeSurvayCompleteStatusToFinished(
    userId: string,
    surveyId: string,
  ) {
    return await this.User.updateOne(
      { _id: userId },
      {
        $set: {
          'surveysAnswers.$[survey].completeStatus':
            SurveyCompleteStatus.FINISHED,
        },
      },
      {
        arrayFilters: [{ 'survey.surveyId': surveyId }],
      },
    ).exec();
  }
}
