import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSurveyDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsBoolean()
  @IsOptional()
  readonly isPublic?: boolean;
}
