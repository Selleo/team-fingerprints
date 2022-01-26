import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly primary: boolean;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly title: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  readonly primary: boolean;
}

export class QuestionParamsDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly surveyId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly trendId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  readonly questionId?: string;
}
