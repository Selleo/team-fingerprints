import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly name: string;
}

export class UpdateFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly name?: string;
}

export class CreateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly value: string;
}

export class UpdateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly value: string;
}
