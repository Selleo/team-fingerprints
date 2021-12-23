import { IsBoolean, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsBoolean()
  primary: boolean;
}
