import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { FilterTemplateService } from './filter-template.service';

@Controller({ path: 'filter-template', version: '1' })
export class FilterTemplateController {
  constructor(private readonly filterTemplateService: FilterTemplateService) {}

  @Get(':companyId')
  async getFilterTemplatesForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.filterTemplateService.getFilterTemplates(companyId);
  }

  @Post(':companyId')
  async createFilterTemplateForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() templateFilterData: any,
  ) {
    return await this.filterTemplateService.createFilterTemplate(
      templateFilterData,
      companyId,
    );
  }

  @Put(':companyId/filters/:filterId')
  async updateFilterTemplateForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body() templateFilterData: any,
  ) {
    return await this.filterTemplateService.updateFilterTemplate(
      templateFilterData,
      filterId,
      companyId,
    );
  }

  @Delete(':companyId/filters/:filterId')
  async removeFilterTemplateFromCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
  ) {
    return await this.filterTemplateService.removeFilterTemplate(
      filterId,
      companyId,
    );
  }

  @Get(':companyId/teams/:teamId')
  async getFilterTemplatesForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.filterTemplateService.getFilterTemplates(
      companyId,
      teamId,
    );
  }

  @Post(':companyId/teams/:teamId')
  async createFilterTemplateForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body() templateFilterData: any,
  ) {
    return await this.filterTemplateService.createFilterTemplate(
      templateFilterData,
      companyId,
      teamId,
    );
  }

  @Put(':companyId/teams/:teamId/filters/:filterId')
  async updateFilterTemplateForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body() templateFilterData: any,
  ) {
    return await this.filterTemplateService.updateFilterTemplate(
      templateFilterData,
      filterId,
      companyId,
      teamId,
    );
  }

  @Delete(':companyId/teams/:teamId/filters/:filterId')
  async removeFilterTemplateFromTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
  ) {
    return await this.filterTemplateService.removeFilterTemplate(
      filterId,
      companyId,
      teamId,
    );
  }
}