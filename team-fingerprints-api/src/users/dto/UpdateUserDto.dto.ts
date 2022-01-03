import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly email: string;
}
