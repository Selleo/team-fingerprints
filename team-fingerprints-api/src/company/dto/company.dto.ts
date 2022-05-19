import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDefined()
  @Trim()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Trim()
  readonly domain?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly pointShape: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly pointColor: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDefined()
  @Trim()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly domain?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  readonly pointShape?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  readonly pointColor?: string;
}

export class EmailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;
}
