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
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/role.type';
import { TemplateFilterConfigDto } from './dto/filter-templates.dto';
import { FilterTemplateService } from './filter-template.service';

@Controller({ path: 'filter-templates', version: '1' })
export class FilterTemplateController {
  constructor(private readonly filterTemplateService: FilterTemplateService) {}

  @Get(':companyId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getFilterTemplatesForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.filterTemplateService.getFilterTemplates(companyId);
  }

  @Post(':companyId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async createFilterTemplateForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body('templateFilter') templateFilter: any,
    @Body('templateFilterConfig')
    templateFilterConfig: TemplateFilterConfigDto,
  ) {
    return await this.filterTemplateService.createFilterTemplate(
      templateFilter,
      templateFilterConfig,
      companyId,
    );
  }

  @Put(':companyId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async updateFilterTemplateForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body('templateFilter') templateFilter: any,
    @Body('templateFilterConfig')
    templateFilterConfig: TemplateFilterConfigDto,
  ) {
    return await this.filterTemplateService.updateFilterTemplate(
      templateFilter,
      templateFilterConfig,
      filterId,
      companyId,
    );
  }

  @Delete(':companyId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
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
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
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
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async createFilterTemplateForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('templateFilter') templateFilter: any,
    @Body('templateFilterConfig')
    templateFilterConfig: TemplateFilterConfigDto,
  ) {
    return await this.filterTemplateService.createFilterTemplate(
      templateFilter,
      templateFilterConfig,
      companyId,
      teamId,
    );
  }

  @Put(':companyId/teams/:teamId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async updateFilterTemplateForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body('templateFilter') templateFilter: any,
    @Body('templateFilterConfig')
    templateFilterConfig: TemplateFilterConfigDto,
  ) {
    return await this.filterTemplateService.updateFilterTemplate(
      templateFilter,
      templateFilterConfig,
      filterId,
      companyId,
      teamId,
    );
  }

  @Delete(':companyId/teams/:teamId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
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
