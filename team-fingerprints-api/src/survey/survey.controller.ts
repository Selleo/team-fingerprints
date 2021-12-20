import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurveysAll() {
    return await this.surveyService.getSurveysAll();
  }

  @Get('/:surveyId')
  async getSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }

  @Post()
  async createSurvey(@Body('title') title: string) {
    return await this.surveyService.createSurvey(title);
  }

  @Delete('/:surveyId')
  async removeSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
