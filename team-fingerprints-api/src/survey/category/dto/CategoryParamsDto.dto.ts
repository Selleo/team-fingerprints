import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CategoryParamsDto {
  @IsString()
  @IsMongoId()
  readonly surveyId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  readonly categoryId: string;
}
