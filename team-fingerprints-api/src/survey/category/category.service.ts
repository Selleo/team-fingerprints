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

  async getCategories({ surveyId }: CategoryParamsDto) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    return surveyExists.categories;
  }

  async createCategory(
    { surveyId }: CategoryParamsDto,
    body: CreateCategoryDto,
  ) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    surveyExists.categories.push({ title: body.data.title });
    return await surveyExists.save();
  }

  async updateCategory(
    { surveyId, categoryId }: CategoryParamsDto,
    body: UpdateCategoryDto,
  ) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
        'categories._id': categoryId,
      },
      {
        $set: {
          'categories.$.title': body.data.title,
        },
      },
    );
  }

  async removeCategory({ categoryId, surveyId }: CategoryParamsDto) {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    return await this.surveyModel.updateOne(
      {
        _id: surveyId,
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
