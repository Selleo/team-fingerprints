import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
import { Category } from 'team-fingerprints-common';

export class CreateCategoryDto implements Partial<Category> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
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
