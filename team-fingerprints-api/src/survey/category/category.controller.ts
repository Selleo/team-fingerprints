import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryParamsDto } from './dto/CategoryParamsDto.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(@Param() params: CategoryParamsDto) {
    return await this.categoryService.getCategories(params);
  }

  @Post()
  async createCategory(
    @Param() params: CategoryParamsDto,
    @Body() body: CreateCategoryDto,
  ) {
    return await this.categoryService.createCategory(params, body);
  }

  @Patch('/:categoryId')
  async updateCateory(
    @Param() params: CategoryParamsDto,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(params, body);
  }

  @Delete('/:categoryId')
  async removeCategory(@Param() params: CategoryParamsDto) {
    return this.categoryService.removeCategory(params);
  }
}
