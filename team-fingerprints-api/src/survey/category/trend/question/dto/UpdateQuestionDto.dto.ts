import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  primary: boolean;
}
