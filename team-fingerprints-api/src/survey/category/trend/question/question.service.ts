import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import {
  CreateQuestionDto,
  QuestionParamsDto,
  UpdateQuestionDto,
} from './dto/question.dto';
import { SurveyService } from 'src/survey/survey.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => SurveyService))
    private readonly surveyService: SurveyService,
  ) {}

  async createQuestion(
    { surveyId, categoryId, trendId }: QuestionParamsDto,
    { title, primary }: CreateQuestionDto,
  ): Promise<Survey> {
    await this.surveyService.canEditSurvey(surveyId);

    let newQuestion: Survey;
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      newQuestion = await this.surveyModel
        .findByIdAndUpdate(
          {
            _id: surveyId,
          },
          {
            $push: {
              'categories.$[category].trends.$[trend].questions': {
                title,
                primary,
              },
            },
          },
          {
            arrayFilters: [
              { 'trend._id': trendId },
              { 'category._id': categoryId },
            ],
            new: true,
          },
        )
        .session(session)
        .exec();
      if (!newQuestion) {
        throw new BadRequestException();
      }

      await this.surveyModel
        .findByIdAndUpdate(
          { _id: surveyId },
          {
            $inc: { amountOfQuestions: 1 },
          },
          { session, new: true },
        )
        .exec();
    });
    session.endSession();
    return newQuestion;
  }

  async updateQuestion(
    { surveyId, categoryId, trendId, questionId }: QuestionParamsDto,
    { title, primary }: UpdateQuestionDto,
  ): Promise<Survey> {
    return await this.surveyModel.findByIdAndUpdate(
      {
        _id: surveyId,
      },
      {
        $set: {
          'categories.$[category].trends.$[trend].questions.$[question].title':
            title,
          'categories.$[category].trends.$[trend].questions.$[question].primary':
            primary,
        },
      },
      {
        arrayFilters: [
          { 'question._id': questionId },
          { 'trend._id': trendId },
          { 'category._id': categoryId },
        ],
        new: true,
      },
    );
  }

  async removeQuestion(surveyId: string, questionId: string): Promise<Survey> {
    await this.surveyService.canEditSurvey(surveyId);
    let removedQuestion: Survey;
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      removedQuestion = await this.surveyModel
        .findOneAndUpdate(
          {
            'categories.trends.questions._id': questionId,
          },
          {
            $pull: {
              'categories.$.trends.$[].questions': { _id: questionId },
            },
          },
          {
            session,
            new: true,
          },
        )
        .exec();

      if (!removedQuestion) {
        throw new BadRequestException();
      }

      await this.surveyModel
        .findByIdAndUpdate(
          { _id: surveyId },
          {
            $inc: { amountOfQuestions: -1 },
          },
          {
            session,
            new: true,
          },
        )
        .exec();
    });

    session.endSession();
    return removedQuestion;
  }

  async removeQuestions(surveyId: string, questions: string[]): Promise<void> {
    questions.forEach(async (questionId) => {
      const session = await this.connection.startSession();
      await session.withTransaction(async () => {
        const removedQuestion = await this.surveyModel
          .findOneAndUpdate(
            {
              'categories.trends.questions._id': questionId,
            },
            {
              $pull: {
                'categories.$.trends.$[].questions': { _id: questionId },
              },
            },
            {
              session,
              new: true,
            },
          )
          .exec();

        await this.surveyModel
          .findOneAndUpdate(
            { _id: surveyId },
            {
              $inc: { amountOfQuestions: -1 },
            },
            {
              session,
              new: true,
            },
          )
          .exec();

        return removedQuestion;
      });
    });
  }
}
