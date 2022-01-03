import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QuestionResponseDto {
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
