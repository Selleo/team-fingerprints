import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { QuestionAnswerDto } from './dto/question-answer.dto';
import { SurveyAnswerService } from './survey-answer.service';

@ApiTags('survey-answers')
@Controller({ path: 'survey-answers', version: '1' })
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Get(':surveyId')
  @UseInterceptors(CacheInterceptor)
  async getUserAnswers(
    @CurrentUserId(ValidateObjectId) userId: any,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyAnswerService.getUserAnswers(userId, surveyId);
  }

  @Post(':surveyId')
  async saveUserSurveyAnswer(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyAnswerData: QuestionAnswerDto,
  ) {
    return await this.surveyAnswerService.saveUserSurveyAnswer(
      userId,
      surveyId,
      surveyAnswerData,
    );
  }

  @Post(':surveyId/finish')
  async finishSurvey(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyAnswerService.finishSurvey(userId, surveyId);
  }
}
