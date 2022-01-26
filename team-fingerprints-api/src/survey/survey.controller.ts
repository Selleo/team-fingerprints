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
import { CurrentUserRole } from 'src/common/decorators/currentUserRole.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { Role } from 'src/role/role.type';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurveysByRole(@CurrentUserRole() role: Role): Promise<Survey[]> {
    return await this.surveyService.getSurveysByRole(role);
  }

  @Get('/:surveyId')
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserRole() role: Role,
  ): Promise<Survey> {
    return this.surveyService.getSurvey(surveyId, role);
  }

  @Post()
  @UseGuards(RoleGuard([Role.SUPER_ADMIN]))
  async createSurvey(@Body() surveyDto: CreateSurveyDto): Promise<Survey> {
    return await this.surveyService.createSurvey(surveyDto);
  }

  @Patch('/:surveyId')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN]))
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.updateSurvey(surveyId, surveyDto);
  }

  @Delete('/:surveyId')
  @UseGuards(RoleGuard([Role.SUPER_ADMIN]))
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<Survey> {
    return this.surveyService.removeSurvey(surveyId);
  }
}
