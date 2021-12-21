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
    { data }: CreateQuestionDto,
  ) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
      },
      {
        $push: {
          'categories.$[category].trends.$[trend].questions': data,
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
    { data }: UpdateQuestionDto,
  ) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
      },
      {
        $set: {
          'categories.$[category].trends.$[trend].questions.$[question].title':
            data.title,
          'categories.$[category].trends.$[trend].questions.$[question].primary':
            data.primary,
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
    console.log(questionId);
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
