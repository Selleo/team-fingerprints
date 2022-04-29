import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserDetail, User } from 'team-fingerprints-common';

export class CreateUserDto implements Partial<User> {
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

export class UpdateUserDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly companyId?: string;

  @IsNotEmpty()
  @IsOptional()
  @ValidateNested()
  readonly userDetails?: UserDetail[];
}
