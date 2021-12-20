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
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/:categoryId')
  async getCategory(@Param('categoryId') categoryId: string): Promise<string> {
    return await this.categoryService.getCategory(categoryId);
  }

  @Post()
  async createCategory(@Body() body: CreateCategoryDto) {
    return await this.categoryService.createCategory(body);
  }

  @Patch('/:categoryId')
  async updateCateory(
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(categoryId, body);
  }

  @Delete('/:categoryId')
  async removeCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.removeCategory(categoryId);
  }
}
