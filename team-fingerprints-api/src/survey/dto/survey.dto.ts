import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

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
