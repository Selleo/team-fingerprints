import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { QuestionParamsDto } from './dto/QuestionParamsDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async createQuestion(
    { surveyId, categoryId, trendId }: QuestionParamsDto,
    { title, primary }: CreateQuestionDto,
  ) {
    return await this.surveyModel.updateOne(
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
    );
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

  async removeQuestion(questionId: string) {
    return await this.surveyModel.updateOne(
      {
        'categories.trends.questions._id': questionId,
      },
      {
        $pull: {
          'categories.$.trends.$[].questions': { _id: questionId },
        },
      },
    );
  }
}
