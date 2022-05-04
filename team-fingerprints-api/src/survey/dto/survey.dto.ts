import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
import { Survey } from 'team-fingerprints-common';

export class CreateSurveyDto implements Partial<Survey> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly title: string;
}

export class UpdateSurveyDto implements Partial<Survey> {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
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
