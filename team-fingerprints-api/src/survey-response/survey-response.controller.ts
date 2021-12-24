import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserSurveyResponseDto } from './dto/UserSurveyResponseDto.dto ';
import { SurveyResponseService } from './survey-response.service';

@Controller({ path: 'survey-response', version: '1' })
export class SurveyResponseController {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @Post('/:userId')
  async saveUsersSurveyRespone(
    @Param('userId') userId: string,
    @Body() surveyResponseData: UserSurveyResponseDto,
  ) {
    return await this.surveyResponseService.saveUsersSurveyRespone(
      userId,
      surveyResponseData,
    );
  }
}
