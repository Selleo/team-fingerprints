import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserI } from '../interfaces/user.interface';

export class CreateUserDto implements Partial<UserI> {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly lastName?: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly authId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly pictureUrl?: string;
}

export class UpdateUserDto implements Partial<UserI> {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly companyId?: string;
}
