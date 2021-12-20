import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class QuestionController {
  @Get()
  printSth() {
    return 'question path';
  }

  @Get(':questionId')
  helloWorld(@Param('questionId') questionId: string): string {
    return questionId;
  }
}
