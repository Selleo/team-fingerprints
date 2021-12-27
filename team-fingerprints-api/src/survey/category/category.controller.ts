import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CategoryService } from './category.service';
import { CategoryParamsDto } from './dto/CategoryParamsDto.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@ApiTags('category')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
  async removeCategory(
    @Param('categoryId', ValidateObjectId) categoryId: string,
  ) {
    return this.categoryService.removeCategory(categoryId);
  }
}
