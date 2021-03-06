import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags, refs } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { FilterTemplateModel } from 'src/company/models/filter-template.model';
import { TeamModel } from 'src/company/models/team.model';
import { Roles } from 'src/role/decorators/roles.decorator';
import { DetailQuery, RoleType } from 'team-fingerprints-common';
import { TemplateFilterConfigDto } from './dto/filter-templates.dto';
import { FilterTemplateService } from './filter-template.service';

@ApiTags('filter-templates')
@Controller({ path: 'filter-templates', version: '1' })
export class FilterTemplateController {
  constructor(private readonly filterTemplateService: FilterTemplateService) {}

  @Get('/:surveyId/companies/:companyId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getFilterTemplatesForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ): Promise<FilterTemplateModel[]> {
    return await this.filterTemplateService.getFilterTemplatesForCompany(
      surveyId,
      companyId,
    );
  }

  @Post('/:surveyId/companies/:companyId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async createFilterTemplateForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Body('filters') filters: DetailQuery,
    @Body() templateFilterConfig: TemplateFilterConfigDto,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.createFilterTemplateInCompany(
      surveyId,
      filters,
      templateFilterConfig,
      companyId,
    );
  }

  @Put('/:surveyId/companies/:companyId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async updateFilterTemplateForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body('filters') filters: DetailQuery,
    @Body() templateFilterConfig: TemplateFilterConfigDto,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.updateFilterTemplateInCompany(
      surveyId,
      filters,
      templateFilterConfig,
      filterId,
      companyId,
    );
  }

  @Delete('/:surveyId/companies/:companyId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async removeFilterTemplateFromCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.removeFilterTemplateFromCompany(
      surveyId,
      filterId,
      companyId,
    );
  }

  @Get('/:surveyId/companies/:companyId/teams/:teamId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async getFilterTemplatesForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<FilterTemplateModel[]> {
    return await this.filterTemplateService.getFilterTemplatesForTeam(
      surveyId,
      companyId,
      teamId,
    );
  }

  @Post('/:surveyId/companies/:companyId/teams/:teamId/filters')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async createFilterTemplateForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Body('filters') filters: DetailQuery,
    @Body()
    templateFilterConfig: TemplateFilterConfigDto,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.createFilterTemplateInTeam(
      surveyId,
      filters,
      templateFilterConfig,
      companyId,
      teamId,
    );
  }

  @Put('/:surveyId/companies/:companyId/teams/:teamId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async updateFilterTemplateForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Body('filters') filters: DetailQuery,
    @Body()
    templateFilterConfig: TemplateFilterConfigDto,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.updateFilterTemplateInTeam(
      surveyId,
      filters,
      templateFilterConfig,
      filterId,
      companyId,
      teamId,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Removing filter template by its id',
    schema: {
      oneOf: refs(FilterTemplateModel, TeamModel),
    },
    type: FilterTemplateModel,
  })
  @Delete('/:surveyId/companies/:companyId/teams/:teamId/filters/:filterId')
  @Roles([RoleType.SUPER_ADMIN, RoleType.COMPANY_ADMIN, RoleType.TEAM_LEADER])
  async removeFilterTemplateFromTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('filterId', ValidateObjectId) filterId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ): Promise<FilterTemplateModel> {
    return await this.filterTemplateService.removeFilterTemplateFromTeam(
      surveyId,
      filterId,
      companyId,
      teamId,
    );
  }
}
