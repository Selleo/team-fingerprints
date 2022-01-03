import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateTrendDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly primary?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly secondary?: string;
}
