import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { Survey } from '../entities/survey.entity';
import { CategoryService } from './category.service';
import { CategoryParamsDto } from './dto/CategoryParamsDto.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@ApiTags('categories')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async createCategory(
    @Param() params: CategoryParamsDto,
    @Body() body: CreateCategoryDto,
  ): Promise<Survey | HttpException> {
    return await this.categoryService.createCategory(params, body);
  }

  @Patch('/:categoryId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async updateCateory(
    @Param() params: CategoryParamsDto,
    @Body() body: UpdateCategoryDto,
  ): Promise<Survey> {
    return await this.categoryService.updateCategory(params, body);
  }

  @Delete('/:categoryId')
  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  async removeCategory(
    @Param('categoryId', ValidateObjectId) categoryId: string,
  ): Promise<Survey> {
    return this.categoryService.removeCategory(categoryId);
  }
}
