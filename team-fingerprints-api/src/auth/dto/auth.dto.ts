import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserDetailI, UserProfileI } from 'src/users/interfaces/user.interface';
import { PrivilegeI } from '../interfaces/auth.interface';

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
