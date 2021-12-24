import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsDefined()
  @IsOptional()
  readonly firstName: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsDefined()
  @IsOptional()
  readonly email: string;
}
