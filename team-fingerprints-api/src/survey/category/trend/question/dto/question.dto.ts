import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionI } from 'team-fingerprints-common';

export class CreateQuestionDto implements Partial<QuestionI> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly primary: boolean;
}

export class UpdateQuestionDto implements Partial<QuestionI> {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  readonly primary: boolean;
}

export class QuestionParamsDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly surveyId: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly trendId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  readonly questionId?: string;
}
