import {
  IsBoolean,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';

export class QuestionResponseDto {
  @IsString()
  @IsMongoId()
  @IsDefined()
  readonly questionId: string;

  @IsNumber()
  @IsDefined()
  readonly value: string;

  @IsBoolean()
  @IsDefined()
  readonly primary: boolean;
}
