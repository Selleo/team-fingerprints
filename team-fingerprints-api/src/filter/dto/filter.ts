import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreateFilterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly name: string;
}

export class UpdateFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  readonly name?: string;
}

export class CreateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly value: string;
}

export class UpdateFilterValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  readonly value: string;
}
