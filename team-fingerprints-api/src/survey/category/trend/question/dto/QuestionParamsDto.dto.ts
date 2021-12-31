import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuestionParamsDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  surveyId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  trendId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  questionId?: string;
}
