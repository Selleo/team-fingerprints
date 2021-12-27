import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsBoolean()
  @IsDefined()
  primary: boolean;
}
