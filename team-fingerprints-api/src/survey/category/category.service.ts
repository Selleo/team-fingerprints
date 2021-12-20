import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Survey } from 'src/entities/survey.entity';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
  ) {}
  async getCategory(categoryId: string) {
    return categoryId;
  }

  async createCategory(body: CreateCategoryDto) {
    return body;
  }

  async updateCategory(questionId: string, body: UpdateCategoryDto) {
    return { questionId, body };
  }

  async removeCategory(questionId: string) {
    return questionId;
  }
}
