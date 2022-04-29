import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TrendI } from 'team-fingerprints-common';

export class CreateTrendDto implements Partial<TrendI> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly primary: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly secondary: string;
}

export class UpdateTrendDto implements Partial<TrendI> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly primary?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly secondary?: string;
}

export class TrendParamsDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  readonly surveyId: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  readonly categoryId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  readonly trendId?: string;
}
