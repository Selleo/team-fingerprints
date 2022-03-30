import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { SurveyResultService } from './survey-result.service';

@Controller({ path: 'survey-results', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Public()
  @Get(':surveyId/companies')
  async getAvgResultForAllCompanies(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Query() queries: any,
  ) {
    return await this.surveyResultService.getAvgResultForAllCompanies(
      surveyId,
      queries,
    );
  }

  @Get(':surveyId/companies/:companyId')
  async getAvgResultForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Query() queries: any,
  ) {
    return await this.surveyResultService.getAvgResultForCompany(
      surveyId,
      companyId,
      queries,
    );
  }

  @Get(':surveyId/companies/:companyId/teams/:teamId')
  async getAvgResultForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Query() queries: any,
  ) {
    return await this.surveyResultService.getAvgResultForTeam(
      surveyId,
      teamId,
      queries,
    );
  }

  @Get(':surveyId/companies/:companyId/teams/:teamId/users/:userId')
  async getSurveyResultForUser(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('userId', ValidateObjectId) userId: string,
  ) {
    return await this.surveyResultService.getSurveyResultForUser(
      surveyId,
      userId,
    );
  }

  @Public()
  @Get('companies/filters')
  async getAvailableFiltersForCompanies() {
    return await this.surveyResultService.getAvailableFiltersForCompanies();
  }

  @Get('companies/:companyId/filters')
  async getAvailableFiltersForCompany(
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.surveyResultService.getAvailableFiltersForCompany(
      companyId,
    );
  }

  @Get('companies/:companyId/teams/:teamId/filters')
  async getAvailableFiltersForTeam(
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.surveyResultService.getAvailableFiltersForTeam(
      companyId,
      teamId,
    );
  }
}
