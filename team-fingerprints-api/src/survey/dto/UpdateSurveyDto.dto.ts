import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateSurveyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isPublic?: boolean;
}
