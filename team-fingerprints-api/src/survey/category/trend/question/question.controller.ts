import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/CreateQuestionDto.dto';
import { UpdateQuestionDto } from './dto/UpdateQuestionDto.dto';
import { QuestionService } from './question.service';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:questionId')
  async getQuestion(@Param('questionId') questionId: string): Promise<string> {
    return await this.questionService.getQuestion(questionId);
  }

  @Post('/')
  async createQuestion(@Body() body: CreateQuestionDto) {
    return await this.questionService.createQuestion(body);
  }

  @Patch('/:questionId')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() body: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestion(questionId, body);
  }

  @Delete('/:questionId')
  async removeQuestion(@Param('questionId') questionId: string) {
    return await this.questionService.removeQuestion(questionId);
  }

  // @Get()
  // getQuestionsByTrendId() {
  //   return { successful: true };
  // }
}
