import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.type';
import { SurveyResultService } from './survey-result.service';

@Controller({ path: 'survey-results', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @UseGuards(RoleGuard())
  @Get(':surveyId')
  async getAvgResultForAllCompanies(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyResultService.getAvgResultForAllCompanies(
      currentUserId,
      surveyId,
    );
  }

  @UseGuards(RoleGuard([Role.COMPANY_ADMIN]))
  @Get(':surveyId/compannies/:companyId')
  async getAvgResultForCompany(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.surveyResultService.getAvgResultForCompany(
      currentUserId,
      surveyId,
      companyId,
    );
  }

  @UseGuards(RoleGuard([Role.COMPANY_ADMIN, Role.TEAM_LEADER]))
  @Get(':surveyId/companies/:companyId/teams/:teamId')
  async getAvgResultForTeam(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.surveyResultService.getAvgResultForTeam(
      currentUserId,
      surveyId,
      companyId,
      teamId,
    );
  }

  @Get(':surveyId/companies/:companyId/teams/:teamId/user/:userId')
  async getSurveyResultForUser(
    @CurrentUserId(ValidateObjectId) currentUserId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Param('userId', ValidateObjectId) userId: string,
  ) {
    return await this.surveyResultService.getSurveyResultForUser(
      currentUserId,
      surveyId,
      companyId,
      teamId,
      userId,
    );
  }
}
