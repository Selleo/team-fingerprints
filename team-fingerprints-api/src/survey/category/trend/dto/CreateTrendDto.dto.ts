import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrendDto {
  @IsString()
  @IsNotEmpty()
  readonly primary: string;

  @IsString()
  @IsNotEmpty()
  readonly secondary: string;
}
