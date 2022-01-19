import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly lastName?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly authId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly pictureUrl?: string;
}
