import { Controller, Delete, Get, Param } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('/:surveyId')
  async getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }

  @Delete('/:surveyId')
  async removeSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
