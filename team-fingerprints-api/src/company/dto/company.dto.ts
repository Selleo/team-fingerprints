import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsFQDN,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDefined()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsFQDN()
  @IsNotEmpty()
  readonly domain: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDefined()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsFQDN()
  @IsString()
  @IsNotEmpty()
  readonly domain?: string;
}
