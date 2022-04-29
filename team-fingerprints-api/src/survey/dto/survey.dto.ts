import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Survey } from 'team-fingerprints-common';

export class CreateSurveyDto implements Partial<Survey> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly title: string;
}

export class UpdateSurveyDto implements Partial<Survey> {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
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
