import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { RoleType } from 'src/role/role.type';
import { Survey } from 'src/survey/models/survey.model';
import {
  CreateQuestionDto,
  QuestionParamsDto,
  UpdateQuestionDto,
} from './dto/question.dto';
import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller({ version: '1' })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async createQuestion(
    @Param() params: QuestionParamsDto,
    @Body() questionDto: CreateQuestionDto,
  ): Promise<void> {
    return await this.questionService.createQuestion(params, questionDto);
  }

  @Patch('/:questionId')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async updateQuestion(
    @Param() params: QuestionParamsDto,
    @Body() questionDto: UpdateQuestionDto,
  ): Promise<Survey> {
    return await this.questionService.updateQuestion(params, questionDto);
  }

  @Delete('/:questionId')
  @UseGuards(RoleGuard([RoleType.SUPER_ADMIN]))
  async removeQuestion(
    @Param('questionId', ValidateObjectId) questionId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ): Promise<void> {
    return await this.questionService.removeQuestion(surveyId, questionId);
  }
}
