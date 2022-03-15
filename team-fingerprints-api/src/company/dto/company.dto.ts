import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointShape?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointColor?: string;
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
  @IsOptional()
  readonly domain?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointShape?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly pointColor?: string;
}

export class ValidateEmail {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
