import { Type } from 'class-transformer';
import {
  IsDefined,
  IsMongoId,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionResponseDto } from './QuestionResponseDto.dto';

export class UserSurveyResponseDto {
  @IsString()
  @IsMongoId()
  @IsDefined()
  readonly surveyId: string;

  @Type(() => QuestionResponseDto)
  @ValidateNested()
  readonly responses: QuestionResponseDto[];
}
