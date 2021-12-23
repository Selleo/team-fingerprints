import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsBoolean()
  @IsOptional()
  primary: boolean;
}
