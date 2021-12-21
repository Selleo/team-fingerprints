import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { SurveyService } from '../survey.service';
import { CategoryParamsDto } from './dto/CategoryParamsDto.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly surveyService: SurveyService,
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}

  async createCategory(
    { surveyId }: CategoryParamsDto,
    { data }: CreateCategoryDto,
  ) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    surveyExists.categories.push({ title: data.title });
    return await surveyExists.save();
  }

  async updateCategory(
    { surveyId, categoryId }: CategoryParamsDto,
    { data }: UpdateCategoryDto,
  ) {
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $set: {
          'categories.$.title': data,
        },
      },
    );
  }

  async removeCategory(categoryId: string) {
    return await this.surveyModel.updateOne(
      {
        'categories._id': categoryId,
      },
      {
        $pull: {
          categories: { _id: categoryId },
        },
      },
    );
  }
}
