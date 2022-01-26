import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrendDto {
  @IsString()
  @IsNotEmpty()
  readonly primary: string;

  @IsString()
  @IsNotEmpty()
  readonly secondary: string;
}

export class UpdateTrendDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly primary?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly secondary?: string;
}

export class TrendParamsDto {
  @IsString()
  @IsMongoId()
  readonly surveyId: string;

  @IsString()
  @IsMongoId()
  readonly categoryId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  readonly trendId: string;
}
