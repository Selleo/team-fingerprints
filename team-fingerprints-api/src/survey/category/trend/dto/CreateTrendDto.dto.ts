import { IsOptional, IsString } from 'class-validator';

export class CreateTrendDto {
  @IsString()
  @IsOptional()
  readonly primary?: string;

  @IsString()
  @IsOptional()
  readonly secondary?: string;
}
