import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QuestionAnswerI } from 'src/users/interfaces/user.interface';

export class QuestionAnswerDto implements QuestionAnswerI {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly questionId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  readonly value: number;
}
