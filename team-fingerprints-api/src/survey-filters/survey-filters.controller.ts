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

@Controller('survey-filters')
export class SurveyFiltersController {
  constructor(private readonly surveyFiltersService: SurveyFiltersService) {}

  @Public()
  @Get('/companies/filters/:surveyId')
  @UseInterceptors(CacheInterceptor)
  async getAvailableFiltersForCompanies(@Param('surveyId') surveyId: string) {
    return await this.surveyFiltersService.getAvailableFiltersForCompanies(
      surveyId,
    );
  }

  @Get('/companies/:companyId/filters/:surveyId')
  async getAvailableFiltersForCompany(
    @Param('surveyId') surveyId: string,
    @Param('companyId', ValidateObjectId) companyId: string,
  ) {
    return await this.surveyFiltersService.getAvailableFiltersForCompany(
      surveyId,
      companyId,
    );
  }

  @Get('/companies/:companyId/teams/:teamId/filters/:surveyId')
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
