import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateObjectId } from 'src/common/pipes/ValidateObjectId.pipe';
import { UserSurveyResponseDto } from './dto/UserSurveyResponseDto.dto ';
import { SurveyResponseService } from './survey-response.service';

@ApiTags('survey-response')
@Controller({ path: 'survey-response', version: '1' })
export class SurveyResponseController {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @Patch('/:userId')
  async saveUsersSurveyRespone(
    @Param('userId', ValidateObjectId) userId: string,
    @Body() surveyResponseData: UserSurveyResponseDto,
  ) {
    return await this.surveyResponseService.saveUsersSurveyRespone(
      userId,
      surveyResponseData,
    );
  }
}
