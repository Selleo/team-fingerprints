import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Optional } from 'utility-types';
import { UserDetailsI, UserI } from '../interfaces/user.interface';

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

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @ValidateNested()
  readonly userDetails?: UserDetailsI;
}

// export class UserDetailsDto implements Optional<UserDetailsI> {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   readonly country: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   readonly companyType: string;

//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   readonly yearOfExperience: number;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   readonly mainTechnology: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   readonly techLevel: string;
// }

export class UpdateUserDetailsDto implements Optional<UserDetailsI> {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly companyType?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly yearOfExperience?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly mainTechnology?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly techLevel?: string;
}
