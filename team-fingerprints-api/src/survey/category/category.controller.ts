import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CategoryService } from './category.service';
import { CategoryParamsDto } from './dto/CategoryParamsDto.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';

@ApiTags('categories')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createCategory(
    @Param() params: CategoryParamsDto,
    @Body() body: CreateCategoryDto,
  ) {
    return await this.categoryService.createCategory(params, body);
  }

  @Patch('/:categoryId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateCateory(
    @Param() params: CategoryParamsDto,
    @Body() body: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(params, body);
  }

  @Delete('/:categoryId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeCategory(
    @Param('categoryId', ValidateObjectId) categoryId: string,
  ) {
    return this.categoryService.removeCategory(categoryId);
  }
}
