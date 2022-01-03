import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  primary: boolean;
}
