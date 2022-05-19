import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserSurveyResultModel } from 'src/users/models/user-survey-result.model';
import { DetailQuery, FinishedSurveyResult } from 'team-fingerprints-common';
import { SurveyResult, SurveyResultService } from './survey-result.service';

@ApiTags('survey-results')
@Controller({ path: 'survey-results', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @ApiQuery({
    type: String,
    description: `Use optional query to get specific resuls.
      Query is dependent on filters eg. for country you have to pass id for given country: country=507f1f77bcf86cd799439011.
      Get available filters and values from /survey-filters`,
  })
  @ApiResponse({ type: UserSurveyResultModel })
  @Public()
  @Get('/:surveyId/companies')
  @UseInterceptors(CacheInterceptor)
  async getAvgResultForAllCompanies(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Query() queries: DetailQuery,
  ): Promise<SurveyResult> {
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
  ): Promise<SurveyResult> {
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
  ): Promise<SurveyResult> {
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
  ): Promise<FinishedSurveyResult[]> {
    return (
      await this.surveyResultService.getSurveyResultForUsers(surveyId, [userId])
    )[0];
  }
}
