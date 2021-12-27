import { IsString, IsOptional } from 'class-validator';

export class UpdateTrendDto {
  @IsString()
  @IsOptional()
  readonly primary?: string;

  @IsString()
  @IsOptional()
  readonly secondary?: string;
}
