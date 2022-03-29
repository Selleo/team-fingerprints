import { Body, Controller, Param, Post } from '@nestjs/common';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { FilterTemplateService } from './filter-template.service';

@Controller({ path: 'filter-template', version: '1' })
export class FilterTemplateController {
  constructor(private readonly filterTemplateService: FilterTemplateService) {}

  @Post(':companyId')
  async createFilterTemplateForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body() templateFilterData: any,
  ) {
    return await this.filterTemplateService.createTemplateFilter(
      templateFilterData,
      companyId,
    );
  }

  @Post(':companyId/teams/:teamId')
  async createFilterTemplateForCompany(
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
