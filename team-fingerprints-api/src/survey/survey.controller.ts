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
import { CurrentUserRole } from 'src/common/decorators/currentUserRole.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'src/role/role.type';
import { Survey } from './models/survey.model';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  @Roles([
    RoleType.SUPER_ADMIN,
    RoleType.COMPANY_ADMIN,
    RoleType.TEAM_LEADER,
    RoleType.USER,
  ])
  async getSurveysByRole(
    @CurrentUserRole() role: RoleType,
    @CurrentUserId(ValidateObjectId) userId,
  ): Promise<(Survey & 'completeStatus')[] | Survey[]> {
    return await this.surveyService.getSurveysByRole(role, userId);
  }

  @Get('/:surveyId')
  @Roles([
    RoleType.SUPER_ADMIN,
    RoleType.COMPANY_ADMIN,
    RoleType.TEAM_LEADER,
    RoleType.USER,
  ])
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserRole() role: RoleType,
  ): Promise<Survey> {
    return this.surveyService.getSurvey(surveyId, role);
  }

  @Post()
  @Roles([RoleType.SUPER_ADMIN])
  async createSurvey(@Body() surveyDto: CreateSurveyDto): Promise<Survey> {
    return await this.surveyService.createSurvey(surveyDto);
  }

  @Patch('/:surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.updateSurvey(surveyId, surveyDto);
  }

  @Delete('/:surveyId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<Survey> {
    return this.surveyService.removeSurvey(surveyId);
  }
}
