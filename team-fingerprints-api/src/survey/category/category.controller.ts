import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'src/role/role.type';
import { Survey } from '../models/survey.model';
import { CategoryService } from './category.service';
import {
  CategoryParamsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('categories')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createCategory(
    @Param() params: CategoryParamsDto,
    @Body() categoryDto: CreateCategoryDto,
  ): Promise<Survey | HttpException> {
    return await this.categoryService.createCategory(params, categoryDto);
  }

  @Patch('/:categoryId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateCateory(
    @Param() params: CategoryParamsDto,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<Survey> {
    return await this.categoryService.updateCategory(params, categoryDto);
  }

  @Delete('/:categoryId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeCategory(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('categoryId', ValidateObjectId) categoryId: string,
  ): Promise<Survey> {
    return this.categoryService.removeCategory(surveyId, categoryId);
  }
}
