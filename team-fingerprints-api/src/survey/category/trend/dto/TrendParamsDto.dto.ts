import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
