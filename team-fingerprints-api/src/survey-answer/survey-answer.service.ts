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
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserModel } from 'src/users/models/user.model';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { SurveySummarizeService } from 'src/survey-summarize/survey-summarize.service';
import { SurveyResultService } from 'src/survey-result/survey-result.service';
import { SurveyService } from 'src/survey/survey.service';
import { SurveyFiltersService } from 'src/survey-filters/survey-filters.service';
import { SurveyCompleteStatus } from 'team-fingerprints-common';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => SurveyResultService))
    private readonly surveyResultService: SurveyResultService,
    private readonly surveySummarizeService: SurveySummarizeService,
    private readonly surveyService: SurveyService,
    private readonly surveyFiltersService: SurveyFiltersService,
  ) {}

  async getUserAnswers(userId: string, surveyId: string): Promise<UserModel> {
    return await this.userModel
      .findOne(
        { _id: userId, 'surveysAnswers.surveyId': surveyId },
        {
          'surveysAnswers.$': 1,
        },
      )
      .exec();
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

  async finishSurvey(userId: string, surveyId: string) {
    if (await this.checkIfSurveyIsFinished(userId, surveyId))
      return await this.surveyResultService.getSurveyResultForUsers(surveyId, [
        userId,
      ]);

    await this.changeSurvayCompleteStatusToFinished(userId, surveyId);

    const calculatedAnswers =
      await this.surveySummarizeService.countPointsForUser(userId, surveyId);

    await this.saveCalculatedAnswers(userId, surveyId, calculatedAnswers);

    await this.surveyResultService.countPointsJob(surveyId);
    await this.surveyFiltersService.getAvailableFiltersForCompaniesJob(
      surveyId,
    );
    return await this.surveyResultService.getSurveyResultForUsers(surveyId, [
      userId,
    ]);
  }

  private async changeAnswer(
    userId: string,
    surveyId: string,
    { value, questionId }: QuestionAnswerDto,
  ): Promise<UserModel | HttpException> {
    if (await this.checkIfSurveyIsFinished(userId, surveyId))
      throw new ForbiddenException();

    let updatedAnswer: UserModel;

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

  async getSurveyCompleteStatus(userId: string, surveyId: string) {
    const user = await this.userModel
      .findOne({
        _id: new Types.ObjectId(userId).toString(),
        'surveysAnswers.$.surveyId': surveyId,
      })
      .exec();

    if (!user) return SurveyCompleteStatus.NEW;

    const surveyAnswer = user?.surveysAnswers?.find(
      (answer) => answer.surveyId === new Types.ObjectId(surveyId).toString(),
    );
    if (!surveyAnswer) return SurveyCompleteStatus.NEW;

    return surveyAnswer.completeStatus;
  }

  async changeSurvayCompleteStatusToFinished(userId: string, surveyId: string) {
    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            'surveysAnswers.$[survey].completeStatus':
              SurveyCompleteStatus.FINISHED,
          },
        },
        {
          arrayFilters: [{ 'survey.surveyId': surveyId }],
          new: true,
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
