import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class CategoryParamsDto {
  @IsString()
  @IsMongoId()
  readonly surveyId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  readonly categoryId?: string;
}
