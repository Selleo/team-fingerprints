import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class UpdateFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;
}

export class CreateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly value: string;
}
