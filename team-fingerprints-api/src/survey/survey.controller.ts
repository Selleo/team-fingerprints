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
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CreateSurveyDto } from './dto/CreateSurveyDto.dto';
import { UpdateSurveyDto } from './dto/UpdateSurveyDto.dto';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';

@ApiTags('surveys')
@Controller({ version: '1' })
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurveysByRole(@CurrentUserRole() role: UserRole): Promise<Survey[]> {
    return await this.surveyService.getSurveysByRole(role);
  }

  @Get('/:surveyId')
  async getSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @CurrentUserRole() role: UserRole,
  ): Promise<Survey> {
    return this.surveyService.getSurvey(surveyId, role);
  }

  @Post()
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createSurvey(@Body() body: CreateSurveyDto): Promise<Survey> {
    return await this.surveyService.createSurvey(body);
  }

  @Patch('/:surveyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() body: UpdateSurveyDto,
  ): Promise<Survey> {
    return await this.surveyService.updateSurvey(surveyId, body);
  }

  @Delete('/:surveyId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeSurvey(
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<Survey> {
    return this.surveyService.removeSurvey(surveyId);
  }
}
