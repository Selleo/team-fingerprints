import { IsDefined, IsString } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsDefined()
  readonly title: string;
}
