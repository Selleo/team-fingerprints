import { IsOptional, IsString } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsOptional()
  readonly title?: string;
}
