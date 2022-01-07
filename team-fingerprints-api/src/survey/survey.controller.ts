import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';
import { SurveyService } from './survey.service';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Public()
  @Get()
  async getSurveysAll() {
    return await this.surveyService.getSurveysAll();
  }

  @Get('/:surveyId')
  async getSurvey(@Param('surveyId', ValidateObjectId) surveyId: string) {
    return this.surveyService.getSurvey(surveyId);
  }

  @Post()
  async createSurvey(@Body() body: CreateSurveyDto) {
    return await this.surveyService.createSurvey(body);
  }

  @Patch('/:surveyId')
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() body: UpdateSurveyDto,
  ) {
    return await this.surveyService.updateSurvey(surveyId, body);
  }

  @Delete('/:surveyId')
  async removeSurvey(@Param('surveyId', ValidateObjectId) surveyId: string) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
