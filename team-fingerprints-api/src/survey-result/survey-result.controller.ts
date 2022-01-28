import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { SurveyResultService } from './survey-result.service';

@Controller({ path: 'survey-result', version: '1' })
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Get(':surveyId/finish')
  async getSurveyResult(
    @CurrentUserId(ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveyResultService.getSurveyResult(userId, surveyId);
  }
}
