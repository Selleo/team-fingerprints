import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { QuestionResponseDto } from './QuestionResponseDto.dto';

export class UserSurveyResponseDto {
  @Type(() => QuestionResponseDto)
  @ValidateNested()
  readonly response: QuestionResponseDto;
}
