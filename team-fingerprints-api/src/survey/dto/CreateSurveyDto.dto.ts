import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}
