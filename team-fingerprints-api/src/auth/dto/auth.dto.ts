import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleType } from 'src/role/role.type';
import { UserProfileI } from '../interfaces/auth.interface';

export class ResponseAuthDto implements UserProfileI {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly role: RoleType;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly canCreateTeam: boolean;

  @ApiPropertyOptional()
  @ValidateNested()
  @IsNotEmpty()
  readonly company: {
    _id: string;
    name: string;
    description?: string | undefined;
  };

  @ApiPropertyOptional()
  @ValidateNested()
  @IsNotEmpty()
  readonly team: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
}
