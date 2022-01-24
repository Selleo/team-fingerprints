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
import { RoleGuard } from 'src/common/decorators/role.guard';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserRole } from 'src/users/user.type';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { QuestionParamsDto } from './dto/QuestionParamsDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';
import { QuestionService } from './question.service';

@ApiTags('questions')
@Controller({ version: '1' })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async createQuestion(
    @Param() params: QuestionParamsDto,
    @Body() body: CreateQuestionDto,
  ) {
    return await this.questionService.createQuestion(params, body);
  }

  @Patch('/:questionId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async updateQuestion(
    @Param() params: QuestionParamsDto,
    @Body() body: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestion(params, body);
  }

  @Delete('/:questionId')
  @UseGuards(RoleGuard([UserRole.COMPANY_ADMIN]))
  async removeQuestion(
    @Param('questionId', ValidateObjectId) questionId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.questionService.removeQuestion(surveyId, questionId);
  }
}
