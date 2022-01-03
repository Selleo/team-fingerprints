import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  role: string;
}
