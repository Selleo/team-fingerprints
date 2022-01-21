import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { SurveySummarizeService } from './survey-summarize.service';

ApiTags('survey-summarizes');
@Controller({ path: 'survey-summarizes', version: '1' })
export class SurveySummarizeController {
  constructor(
    private readonly surveySummarizeService: SurveySummarizeService,
  ) {}

  @Get(':surveyId')
  async countPoints(
    @CurrentUserId() userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveySummarizeService.countPoints(userId, surveyId);
  }
}
