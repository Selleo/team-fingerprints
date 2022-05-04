import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
import { Trend } from 'team-fingerprints-common';

export class CreateTrendDto implements Partial<Trend> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly primary: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly secondary: string;
}

export class UpdateTrendDto implements Partial<Trend> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  readonly primary?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Trim()
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
