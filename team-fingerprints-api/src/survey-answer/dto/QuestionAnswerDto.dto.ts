import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QuestionAnswerDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly value: string;
}
