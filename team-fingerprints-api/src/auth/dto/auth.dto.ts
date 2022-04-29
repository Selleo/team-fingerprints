import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserDetailI, UserProfileI } from 'team-fingerprints-common';
import { PrivilegeI } from 'team-fingerprints-common';

export class ResponseAuthDto implements UserProfileI {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @ValidateNested()
  privileges: PrivilegeI[];

  @ApiProperty()
  @ValidateNested()
  userDetails: UserDetailI[];
}
