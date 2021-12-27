import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { QuestionParamsDto } from './dto/QuestionParamsDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';
import { QuestionService } from './question.service';

@ApiTags('question')
@Controller({ version: '1' })
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  async createQuestion(
    @Param() params: QuestionParamsDto,
    @Body() body: CreateQuestionDto,
  ) {
    return await this.questionService.createQuestion(params, body);
  }

  @Patch('/:questionId')
  async updateQuestion(
    @Param() params: QuestionParamsDto,
    @Body() body: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestion(params, body);
  }

  @Delete('/:questionId')
  async removeQuestion(
    @Param('questionId', ValidateObjectId) questionId: string,
  ) {
    return await this.questionService.removeQuestion(questionId);
  }
}
