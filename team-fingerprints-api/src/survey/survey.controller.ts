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
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'src/role/role.type';
import { Survey } from './models/survey.model';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { Roles } from 'src/role/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurveysByRole(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<(Survey & 'completeStatus')[] | Survey[]> {
    return await this.surveyService.getSurveysByRole(userId);
  }

  @Public()
  @Get('public')
  async getSurveys(): Promise<(Survey & 'completeStatus')[] | Survey[]> {
    return await this.surveyService.getSurveys();
  }

  @Get(':surveyId')
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<Survey> {
    return this.surveyService.getSurveyByRole(surveyId, userId);
  }

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createSurvey(@Body() surveyDto: CreateSurveyDto): Promise<Survey> {
    return await this.surveyService.createSurvey(surveyDto);
  }

  @Post(':surveyId/duplicate')
  @Roles([RoleType.SUPER_ADMIN])
  async duplicateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: CreateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.duplicateSurvey(surveyId, surveyDto);
  }

  @Patch(':surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.updateSurvey(surveyId, surveyDto);
  }

  @Delete(':surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<Survey> {
    return this.surveyService.removeSurvey(surveyId);
  }
}
