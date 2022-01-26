import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/role/role.type';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  role: Role;
}
