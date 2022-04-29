import { Transform, Type } from 'class-transformer';
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
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.trim())
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly lastName?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
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
  @Transform(({ value }: { value: string }) => value.trim())
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
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
