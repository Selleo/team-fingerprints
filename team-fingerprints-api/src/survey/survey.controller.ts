import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSurveyDto } from './dto/CreateSurvey.dto';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  helloWorld(): string {
    console.log(this.surveyService.helloWorld());
    return this.surveyService.helloWorld();
  }

  @Post()
  async createSurvey(@Body() createSurveyDto: CreateSurveyDto) {
    return await this.surveyService.createSurvey(createSurveyDto);
  }
}
