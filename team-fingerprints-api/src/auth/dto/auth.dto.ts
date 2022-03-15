import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserDetailsI } from 'src/users/interfaces/user.interface';
import { PrivilegeI, UserProfileI } from '../interfaces/auth.interface';

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
  @ValidateNested()
  privileges: PrivilegeI[];

  @ValidateNested()
  userDetails: UserDetailsI;
}
