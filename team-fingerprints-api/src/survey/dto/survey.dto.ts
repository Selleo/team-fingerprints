import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { SurveyI } from '../interfaces/survey.interface';

export class CreateSurveyDto implements Partial<SurveyI> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

export class UpdateSurveyDto implements Partial<SurveyI> {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isPublic?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly archived?: boolean;
}
