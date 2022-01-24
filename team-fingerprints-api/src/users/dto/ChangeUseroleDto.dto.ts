import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../user.type';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  role: UserRole;
}
