import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.type';
import { SurveyResultService } from './survey-result.service';

@Controller({ path: 'survey-results', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @UseGuards(RoleGuard())
  @Get(':surveyId/companies')
  async getAvgResultForAllCompanies(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyResultService.getAvgResultForAllCompanies(surveyId);
  }

  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  @Get(':surveyId/companies/:companyId')
  async getAvgResultForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.surveyResultService.getAvgResultForCompany(
      surveyId,
      companyId,
    );
  }

  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER]))
  @Get(':surveyId/companies/:companyId/teams/:teamId')
  async getAvgResultForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.surveyResultService.getAvgResultForTeam(surveyId, teamId);
  }

  @Get(':surveyId/companies/:companyId/teams/:teamId/users/:userId')
  async getSurveyResultForUser(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('userId', ValidateObjectId) userId: string,
  ) {
    return await this.surveyResultService.getSurveyResult(surveyId, userId);
  }
}
