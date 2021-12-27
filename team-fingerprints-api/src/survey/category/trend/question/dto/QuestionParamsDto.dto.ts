import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';

export class QuestionParamsDto {
  @IsString()
  @IsMongoId()
  @IsDefined()
  surveyId: string;

  @IsString()
  @IsMongoId()
  @IsDefined()
  categoryId: string;

  @IsString()
  @IsMongoId()
  @IsDefined()
  trendId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  questionId?: string;
}
