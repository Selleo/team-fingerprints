import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { SurveyFiltersService } from './survey-filters.service';

@Controller({ path: 'survey-filters', version: '1' })
export class SurveyFiltersController {
  constructor(private readonly surveyFiltersService: SurveyFiltersService) {}

  @Public()
  @Get('/:surveyId/companies')
  //@UseInterceptors(CacheInterceptor)
  async getAvailableFiltersForCompanies(@Param('surveyId') surveyId: string) {
    return await this.surveyFiltersService.getAvailableFiltersForCompanies(
      surveyId,
    );
  }

  @Get('/:surveyId/companies/:companyId')
  async getAvailableFiltersForCompany(
    @Param('surveyId') surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.surveyFiltersService.getAvailableFiltersForCompany(
      surveyId,
      companyId,
    );
  }

  @Get('/:surveyId/companies/:companyId/teams/:teamId')
  async getAvailableFiltersForTeam(
    @Param('surveyId') surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
    @Param('teamId', ValidateObjectId) teamId: string,
  ) {
    return await this.surveyFiltersService.getAvailableFiltersForTeam(
      surveyId,
      companyId,
      teamId,
    );
  }
}
