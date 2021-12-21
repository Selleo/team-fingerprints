import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';
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
  async createSurvey(@Body() body: CreateSurveyDto) {
    console.log(body);
    return await this.surveyService.createSurvey(body);
  }

  @Patch('/:surveyId')
  async updateSurvey(
    @Param('surveyId') surveyId: string,
    @Body() body: UpdateSurveyDto,
  ) {
    return await this.surveyService.updateSurvey(surveyId, body);
  }

  @Delete('/:surveyId')
  async removeSurvey(@Param('surveyId') surveyId: string) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
