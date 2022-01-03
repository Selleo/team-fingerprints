import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Survey } from 'src/survey/entities/survey.entity';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { QuestionParamsDto } from './dto/QuestionParamsDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createQuestion(
    { surveyId, categoryId, trendId }: QuestionParamsDto,
    { title, primary }: CreateQuestionDto,
  ) {
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
  ) {
    return await this.surveyModel.updateOne(
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
      },
    );
  }

  async removeQuestion(surveyId: string, questionId: string) {
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      const removedQuestion = await this.surveyModel
        .updateOne(
          {
            'categories.trends.questions._id': questionId,
          },
          {
            $pull: {
              'categories.$.trends.$[].questions': { _id: questionId },
            },
          },
        )
        .session(session)
        .exec();

      if (!removedQuestion) {
        throw new BadRequestException();
      }

      await this.surveyModel
        .updateOne(
          { _id: surveyId },
          {
            $inc: { amountOfQuestions: -1 },
          },
          {
            session,
          },
        )
        .exec();

      return removedQuestion;
    });

    session.endSession();
  }
}
