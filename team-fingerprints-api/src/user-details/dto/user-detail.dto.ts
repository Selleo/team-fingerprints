import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDetailDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly savedInUser: boolean;
}

export class UpdateDetailDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly savedInUser?: boolean;
}

export class CreateDetailDtoValue {
  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class UpdateDetailDtoValue {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly value: string;
}
