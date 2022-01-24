import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';
import { SurveyService } from './survey.service';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurveysAll(@CurrentUserId() userId: string) {
    return await this.surveyService.getSurveysAll();
  }

  @Get('/:surveyId')
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.surveyService.getSurvey(surveyId);
  }

  @Post()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createSurvey(
    @Body() body: CreateSurveyDto,
    @CurrentUserId() userId: string,
  ) {
    return await this.surveyService.createSurvey(body);
  }

  @Patch('/:surveyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() body: UpdateSurveyDto,
    @CurrentUserId() userId: string,
  ) {
    return await this.surveyService.updateSurvey(surveyId, body);
  }

  @Delete('/:surveyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.surveyService.removeSurvey(surveyId);
  }
}
