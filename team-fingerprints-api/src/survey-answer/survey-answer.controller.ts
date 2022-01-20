import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { QuestionAnswerDto } from './dto/QuestionAnswerDto.dto';
import { SurveyAnswerService } from './survey-answer.service';

const userId = '121fdsd1';
@ApiTags('survey-answers')
@Controller({ path: 'survey-answers', version: '1' })
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Public()
  @Get(':surveyId')
  async getUserAnswers(@Param('surveyId', ValidateObjectId) surveyId: string) {
    return await this.surveyAnswerService.getUserAnswers(userId, surveyId);
  }

  @Post(':surveyId')
  async saveUserSurveyAnswer(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyAnswerData: QuestionAnswerDto,
  ) {
    return await this.surveyAnswerService.saveUserSurveyAnswer(
      userId,
      surveyId,
      surveyAnswerData,
    );
  }

  @Patch(':surveyId')
  async changeAnswer(
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() updateAnswerData: QuestionAnswerDto,
  ) {
    return await this.surveyAnswerService.changeAnswer(
      userId,
      surveyId,
      updateAnswerData,
    );
  }
}
