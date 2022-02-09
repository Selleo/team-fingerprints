import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from '../models/survey.model';
import { SurveyService } from '../survey.service';
import {
  CategoryParamsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { TrendService } from './trend/trend.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly surveyService: SurveyService,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    private readonly trendService: TrendService,
  ) {}

  async createCategory(
    { surveyId }: CategoryParamsDto,
    { title }: CreateCategoryDto,
  ): Promise<Survey | HttpException> {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) throw new NotFoundException();
    surveyExists.categories.push({ title });
    return await surveyExists.save();
  }

  async updateCategory(
    { surveyId, categoryId }: CategoryParamsDto,
    { title }: UpdateCategoryDto,
  ): Promise<Survey> {
    return await this.surveyModel.findOneAndUpdate(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $set: {
          'categories.$.title': title,
        },
      },
      { new: true },
    );
  }

  async removeCategory(surveyId: string, categoryId: string): Promise<Survey> {
    const { categories }: any = await this.surveyModel.findOne(
      {
        _id: surveyId,
      },
      { categories: true },
    );

    if (!categories) throw new NotFoundException();

    const trendsId = [];
    categories.forEach((category) => {
      if (category?._id.toString() === categoryId) {
        category.trends.forEach((trend) => {
          trendsId.push(trend?._id.toString());
        });
      }
    });
    if (trendsId) {
      trendsId.forEach(async (trendId) => {
        await this.trendService.removeTrend({ surveyId, categoryId, trendId });
      });
    }

    return await this.surveyModel.findOneAndUpdate(
      {
        'categories._id': categoryId,
      },
      {
        $pull: {
          categories: { _id: categoryId },
        },
      },
      { new: true },
    );
  }
}
