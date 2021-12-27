import { IsDefined, IsString } from 'class-validator';

export class CreateTrendDto {
  @IsString()
  @IsDefined()
  readonly primary: string;

  @IsString()
  @IsDefined()
  readonly secondary: string;
}
