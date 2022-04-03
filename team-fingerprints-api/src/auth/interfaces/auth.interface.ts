import { RoleType } from 'src/role/role.type';
import { UserDetailI } from 'src/users/interfaces/user.interface';

export interface UserProfileI {
  readonly _id: string;
  readonly email: string;
  readonly userDetails: UserDetailI[];
  readonly privileges: PrivilegeI[];
}

export interface PrivilegeI {
  readonly roleId: string;
  readonly role: RoleType;
  readonly company?: {
    _id: string;
    name: string;
    description?: string | undefined;
    pointShape?: string;
    pointColor?: string;
  };
  readonly team?: {
    _id: string;
    name: string;
    description?: string | undefined;
    pointShape?: string;
    pointColor?: string;
  };
}
