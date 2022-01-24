import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsOptional()
  logo?: string;
}
