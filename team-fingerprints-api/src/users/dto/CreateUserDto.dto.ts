import { IsDefined, IsEmail, IsString } from 'class-validator';

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
}
