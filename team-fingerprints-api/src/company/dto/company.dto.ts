import {
  IsDefined,
  IsFQDN,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsDefined()
  readonly description?: string;

  @IsString()
  @IsFQDN()
  @IsNotEmpty()
  readonly domain: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsDefined()
  readonly description?: string;

  @IsFQDN()
  @IsString()
  @IsNotEmpty()
  readonly domain?: string;
}
