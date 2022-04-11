import {
  BadRequestException,
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
import { SurveyService } from 'src/survey/survey.service';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => SurveyResultService))
    private readonly surveyResultService: SurveyResultService,
    private readonly surveySummarizeService: SurveySummarizeService,
    private readonly surveyService: SurveyService,
  ) {}

  async getUserAnswers(userId: string, surveyId: string): Promise<User> {
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
  ): Promise<User | HttpException> {
    if (await this.checkIfSurveyIsFinished(userId, surveyId))
      throw new ForbiddenException();
    let updatedAnswer;
    if (value === 0) {
      updatedAnswer = await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          {
            $pull: {
              'surveysAnswers.$[survey].answers': { questionId },
            },
          },
          {
            arrayFilters: [{ 'survey.surveyId': surveyId }],
            new: true,
          },
        )
        .exec();

      await this.userModel
        .updateOne(
          { _id: userId, 'surveysAnswers.surveyId': surveyId },
          {
            $inc: { 'surveysAnswers.$.amountOfAnswers': -1 },
          },
        )
        .exec();
    }

    updatedAnswer = await this.userModel
      .findOneAndUpdate(
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
      )
      .exec();
    return updatedAnswer;
  }

  async saveUserSurveyAnswer(
    userId: string,
    surveyId: string,
    questionAnswerData: QuestionAnswerDto,
  ) {
    if (await this.checkIfSurveyIsFinished(userId, surveyId)) {
      throw new ForbiddenException('Survey is already finished');
    }

    if (await this.surveyIsArchived(surveyId)) {
      throw new BadRequestException('Can not answer archived survey');
    }

    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      let survey = await this.getUserAnswers(userId, surveyId);

      if (!survey) {
        await this.userModel
          .updateOne(
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
        await session.endSession();
        return await this.changeAnswer(userId, surveyId, questionAnswerData);
      }

      const updated = await this.userModel
        .updateOne(
          { _id: userId, 'surveysAnswers.surveyId': surveyId },
          {
            $push: {
              'surveysAnswers.$.answers': questionAnswerData,
            },
          },
          {
            new: true,
          },
        )
        .session(session)
        .exec();

      if (!updated) {
        session.abortTransaction();
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
    });
    await session.endSession();
    return await this.userModel.findById(userId);
  }

  async saveCalculatedAnswers(userId: string, surveyId, data: unknown) {
    return await this.userModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            'surveysAnswers.$[survey].surveyResult': data,
          },
        },
        {
          arrayFilters: [{ 'survey.surveyId': surveyId }],
        },
      )
      .exec();
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

  async getSurveyCompleteStatus(userId: string, surveyId: string) {
    const userWithSurvey = await this.userModel
      .findOne({
        _id: new mongoose.Types.ObjectId(userId),
        'surveysAnswers.$.surveyId': surveyId,
      })
      .exec();

    if (!userWithSurvey) return SurveyCompleteStatus.NEW;
    const surveysAnswers = userWithSurvey.surveysAnswers;

    const surveyAnswer = surveysAnswers?.find(
      (answer) =>
        answer.surveyId === new mongoose.Types.ObjectId(surveyId).toString(),
    );
    if (!surveyAnswer) return SurveyCompleteStatus.NEW;

    return surveyAnswer.completeStatus;
  }

  private async changeSurvayCompleteStatusToFinished(
    userId: string,
    surveyId: string,
  ) {
    return await this.userModel
      .updateOne(
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
      )
      .exec();
  }

  async checkIfSurveyIsFinished(userId: string, surveyId: string) {
    const result = await this.getSurveyCompleteStatus(userId, surveyId);
    return result === SurveyCompleteStatus.FINISHED;
  }

  async surveyIsArchived(surveyId: string): Promise<boolean> {
    const survey = await this.surveyService.getSurvey(surveyId);
    return survey.archived ? true : false;
  }
}
