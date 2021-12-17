import { Controller, Get } from '@nestjs/common';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  helloWorld(): string {
    console.log(this.surveyService.helloWorld());
    return this.surveyService.helloWorld();
  }
}
