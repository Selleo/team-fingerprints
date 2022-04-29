import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'team-fingerprints-common';
import { SurveyModel } from 'src/survey/models/survey.model';
import {
  CreateQuestionDto,
  QuestionParamsDto,
  UpdateQuestionDto,
} from './dto/question.dto';
import { QuestionService } from './question.service';
import { Roles } from 'src/role/decorators/roles.decorator';

@ApiTags('questions')
@Controller({ version: '1' })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  @Roles([RoleType.SUPER_ADMIN])
  async createQuestion(
    @Param() params: QuestionParamsDto,
    @Body() questionDto: CreateQuestionDto,
  ): Promise<SurveyModel> {
    return await this.questionService.createQuestion(params, questionDto);
  }

  @Patch('/:questionId')
  @Roles([RoleType.SUPER_ADMIN])
  async updateQuestion(
    @Param() params: QuestionParamsDto,
    @Body() questionDto: UpdateQuestionDto,
  ): Promise<SurveyModel> {
    return await this.questionService.updateQuestion(params, questionDto);
  }

  @Delete('/:questionId')
  @Roles([RoleType.SUPER_ADMIN])
  async removeQuestion(
    @Param('questionId', ValidateObjectId) questionId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<SurveyModel> {
    return await this.questionService.removeQuestion(surveyId, questionId);
  }
}
