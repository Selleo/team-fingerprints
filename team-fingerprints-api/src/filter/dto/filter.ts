import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFilterDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class UpdateFilterDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;
}

export class CreateFilterValueDto {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateFilterValueDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly value: string;
}
