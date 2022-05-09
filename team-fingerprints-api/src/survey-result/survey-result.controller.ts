import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { DetailQuery } from 'team-fingerprints-common';
import { SurveyResultService } from './survey-result.service';

@Controller({ path: 'survey-results', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Public()
  @Get('/:surveyId/companies')
  @UseInterceptors(CacheInterceptor)
  async getAvgResultForAllCompanies(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Query() queries: DetailQuery,
  ) {
    return await this.surveyResultService.getAvgResultForAllCompanies(
      surveyId,
      queries,
    );
  }

  @Get('/:surveyId/companies/:companyId')
  @UseInterceptors(CacheInterceptor)
  async getAvgResultForCompany(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Query() queries: DetailQuery,
  ) {
    return await this.surveyResultService.getAvgResultForCompany(
      surveyId,
      companyId,
      queries,
    );
  }

  @Get('/:surveyId/companies/:companyId/teams/:teamId')
  @UseInterceptors(CacheInterceptor)
  async getAvgResultForTeam(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
    @Query() queries: DetailQuery,
  ) {
    return await this.surveyResultService.getAvgResultForTeam(
      surveyId,
      teamId,
      queries,
    );
  }

  @Get('/:surveyId/companies/:companyId/teams/:teamId/users/:userId')
  @UseInterceptors(CacheInterceptor)
  async getSurveyResultForUsers(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Param('userId', ValidateObjectId) userId: string,
  ) {
    return (
      await this.surveyResultService.getSurveyResultForUsers(surveyId, [userId])
    )[0];
  }
}
