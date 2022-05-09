import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { FullSurvey, RoleType } from 'team-fingerprints-common';
import { SurveyModel } from './models/survey.model';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { Roles } from 'src/role/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Public()
  @Get('/public')
  @UseInterceptors(CacheInterceptor)
  async getSurveys(): Promise<SurveyModel[]> {
    return await this.surveyService.getSurveys();
  }

  @Public()
  @Get('/:surveyId/public')
  @UseInterceptors(CacheInterceptor)
  async getPublicSurveyById(
    @Param('surveyId', ValidateObjectId) suveyId: string,
  ): Promise<SurveyModel> {
    return await this.surveyService.getPublicSurveyById(suveyId);
  }

  @Get()
  async getSurveysWithCompletionStatus(
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<
    (Partial<SurveyModel> & { completionStatus: string })[] | FullSurvey[]
  > {
    return await this.surveyService.getSurveysWithCompletionStatus(userId);
  }

  @Get('/:surveyId')
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserId(ValidateObjectId) userId: string,
  ): Promise<SurveyModel> {
    return this.surveyService.getSurveyByRole(surveyId, userId);
  }

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createSurvey(@Body() surveyDto: CreateSurveyDto): Promise<SurveyModel> {
    return await this.surveyService.createSurvey(surveyDto);
  }

  @Post('/:surveyId/duplicate')
  @Roles([RoleType.SUPER_ADMIN])
  async duplicateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: CreateSurveyDto,
  ): Promise<SurveyModel> {
    return await this.surveyService.duplicateSurvey(surveyId, surveyDto);
  }

  @Patch('/:surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: UpdateSurveyDto,
  ): Promise<SurveyModel> {
    return await this.surveyService.updateSurvey(surveyId, surveyDto);
  }

  @Delete('/:surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<SurveyModel> {
    return this.surveyService.removeSurvey(surveyId);
  }
}
