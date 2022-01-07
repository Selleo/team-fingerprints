import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { QuestionAnswerDto } from './QuestionAnswerDto.dto';

export class UserSurveyAnswerDto {
  @Type(() => QuestionAnswerDto)
  @ValidateNested()
  readonly answer: QuestionAnswerDto;
}
