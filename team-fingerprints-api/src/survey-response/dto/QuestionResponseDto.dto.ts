import {
  IsDefined,
  IsInt,
  IsMongoId,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QuestionResponseDto {
  @IsString()
  @IsMongoId()
  @IsDefined()
  readonly questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsDefined()
  readonly value: string;
}
