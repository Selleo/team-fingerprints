import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Role } from 'src/role/role.type';
import { UserProfileI } from '../interfaces/auth.interface';

export class ResponseAuthDto implements UserProfileI {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly role: Role;

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
