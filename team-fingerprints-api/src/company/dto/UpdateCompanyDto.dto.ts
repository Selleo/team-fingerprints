import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsMongoId()
  @IsString()
  @IsOptional()
  adminId?: string;
}
