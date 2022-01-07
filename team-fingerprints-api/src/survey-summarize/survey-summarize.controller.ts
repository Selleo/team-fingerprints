import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { SurveySummarizeService } from './survey-summarize.service';

ApiTags('survey-summarizes');
@Controller({ path: 'survey-summarizes', version: '1' })
export class SurveySummarizeController {
  constructor(
    private readonly surveySummarizeService: SurveySummarizeService,
  ) {}

  @Public()
  @Get('/:userId/surveyId/:surveyId')
  async countPoints(
    @Param('userId', ValidateObjectId) userId: string,
    @Param('surveyId', ValidateObjectId) surveyId: string,
  ) {
    return await this.surveySummarizeService.countPoints(userId, surveyId);
  }
}
