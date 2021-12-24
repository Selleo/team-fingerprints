import { IsDefined, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsDefined()
  @IsString()
  role: string;
}
