import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return await this.filterTemplateService.createTemplateFilter(
      templateFilterData,
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
    return await this.filterTemplateService.createTemplateFilter(
      templateFilterData,
      companyId,
      teamId,
    );
  }
}
