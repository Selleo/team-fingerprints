import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('/:surveyId')
  async getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }

  @Post()
  async createSurvey() {
    return await this.surveyService.createSurvey();
  }

  @Delete('/:surveyId')
  async removeSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
