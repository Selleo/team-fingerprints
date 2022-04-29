import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QuestionAnswer } from 'team-fingerprints-common';

export class QuestionAnswerDto implements QuestionAnswer {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  readonly questionId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  readonly value: number;
}
