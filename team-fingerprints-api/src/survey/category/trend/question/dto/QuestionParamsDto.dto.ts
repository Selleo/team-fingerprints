import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class QuestionParamsDto {
  @IsString()
  @IsMongoId()
  surveyId: string;

  @IsString()
  @IsMongoId()
  categoryId: string;

  @IsString()
  @IsMongoId()
  trendId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  questionId: string;
}
