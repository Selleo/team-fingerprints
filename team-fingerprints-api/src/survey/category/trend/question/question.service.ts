import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Survey } from 'src/survey/models/survey.model';
import {
  CreateQuestionDto,
  QuestionParamsDto,
  UpdateQuestionDto,
} from './dto/question.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createQuestion(
    { surveyId, categoryId, trendId }: QuestionParamsDto,
    { title, primary }: CreateQuestionDto,
  ): Promise<void> {
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      const newQuestion = await this.surveyModel
        .updateOne(
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
          },
        )
        .session(session)
        .exec();
      if (!newQuestion) {
        throw new BadRequestException();
      }

      await this.surveyModel
        .updateOne(
          { _id: surveyId },
          {
            $inc: { amountOfQuestions: 1 },
          },
          { session },
        )
        .exec();

      return newQuestion;
    });
    session.endSession();
  }

  async updateQuestion(
    { surveyId, categoryId, trendId, questionId }: QuestionParamsDto,
    { title, primary }: UpdateQuestionDto,
  ): Promise<Survey> {
    return await this.surveyModel.findOneAndUpdate(
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

  async removeQuestion(surveyId: string, questionId: string): Promise<void> {
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

      if (!removedQuestion) {
        throw new BadRequestException();
      }

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

    session.endSession();
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
