import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
