import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from '../entities/survey.entity';
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
    { title }: CreateCategoryDto,
  ): Promise<Survey | HttpException> {
    const surveyExists = await this.surveyService.getSurvey(surveyId);
    if (!surveyExists) return new NotFoundException();
    surveyExists.categories.push({ title });
    return await surveyExists.save();
  }

  async updateCategory(
    { surveyId, categoryId }: CategoryParamsDto,
    { title }: UpdateCategoryDto,
  ): Promise<Survey> {
    return await this.surveyModel.findByIdAndUpdate(
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

  async removeCategory(categoryId: string): Promise<Survey> {
    return await this.surveyModel.findByIdAndUpdate(
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
