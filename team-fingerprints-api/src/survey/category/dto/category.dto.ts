import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';
import { CategoryI } from 'team-fingerprints-common';

export class CreateCategoryDto implements Partial<CategoryI> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class CategoryParamsDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  readonly surveyId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsMongoId()
  @IsOptional()
  readonly categoryId?: string;
}
