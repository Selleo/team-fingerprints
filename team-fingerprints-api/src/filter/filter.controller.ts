import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/role.type';
import {
  CreateFilterDto,
  CreateFilterValueDto,
  UpdateFilterDto,
  UpdateFilterValueDto,
} from './dto/filter';

import { FilterService } from './filter.service';

@ApiTags('filters')
@Controller({ path: 'filters', version: '1' })
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get()
  async getFiltersList() {
    return await this.filterService.getFiltersList();
  }

  @Get('/:filterId')
  async getFilter(@Param('filterId', ValidateObjectId) filterId: string) {
    return await this.filterService.getFilter(filterId);
  }

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createFilter(@Body() { name }: CreateFilterDto) {
    return await this.filterService.createFilter(name);
  }

  @Patch('/:filterId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateFilter(
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body() { name }: UpdateFilterDto,
  ) {
    return await this.filterService.updateFilter(filterId, name);
  }

  @Delete('/:filterId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeFilter(@Param('filterId', ValidateObjectId) filterId: string) {
    return await this.filterService.removeFilter(filterId);
  }

  @Get('/:filterId/values')
  async getFilterWithValues(
    @Param('filterId', ValidateObjectId) filterId: string,
  ) {
    return await this.filterService.getFilterWithValues(filterId);
  }

  @Post('/:filterId/values')
  @Roles([RoleType.SUPER_ADMIN])
  async addFilterValue(
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body() { value }: CreateFilterValueDto,
  ) {
    return await this.filterService.addFilterValue(filterId, value);
  }

  @Patch('/:filterId/values/:valueId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateFilterValue(
    @Param('filterId', ValidateObjectId) filterId: string,
    @Param('valueId', ValidateObjectId) valueId: string,
    @Body() { value }: UpdateFilterValueDto,
  ) {
    return await this.filterService.updateFilterValue(filterId, valueId, value);
  }

  @Delete('/:filterId/values/:valueId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeFilterValue(
    @Param('filterId', ValidateObjectId) filterId: string,
    @Param('valueId', ValidateObjectId) valueId: string,
  ) {
    return await this.filterService.removeFilterValue(filterId, valueId);
  }
}
