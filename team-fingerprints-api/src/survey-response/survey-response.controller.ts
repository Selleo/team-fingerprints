import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { QuestionResponseDto } from './dto/QuestionResponseDto.dto';
import { SurveyResponseService } from './survey-response.service';

@ApiTags('survey-response')
@Controller({ path: 'survey-response', version: '1' })
export class SurveyResponseController {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @Get('/:userId/surveyId/:surveyId')
  async getUserAnswers(
    @Param('userId', ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyResponseService.getUserAnswers(userId, surveyId);
  }

  @Post('/:userId/surveyId/:surveyId')
  async saveUserSurveyRespone(
    @Param('userId', ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
    @Body() surveyResponseData: QuestionResponseDto,
  ) {
    return await this.surveyResponseService.saveUserSurveyRespone(
      userId,
      surveyId,
      surveyResponseData,
    );
  }
}
