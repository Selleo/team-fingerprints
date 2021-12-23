import { IsMongoId, IsOptional, IsString } from 'class-validator';

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
  readonly trendId: string;
}
