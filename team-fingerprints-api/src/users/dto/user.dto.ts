import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';
import {
  UserDetail,
  User,
  UserProfile,
  Privilege,
} from 'team-fingerprints-common';

export class CreateUserDto implements Partial<User> {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  @Trim()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Trim()
  readonly lastName?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
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
  @Trim()
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Trim()
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

export class Profile implements UserProfile {
  _id: string;
  email: string;
  userDetails: UserDetail[];
  privileges: Privilege[];
}
