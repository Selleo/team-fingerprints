import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  readonly firstName: string;

  @IsString()
  @IsDefined()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @IsDefined()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly url?: string;
}
