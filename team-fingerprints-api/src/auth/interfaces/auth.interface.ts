import { RoleType } from 'src/role/role.type';

export interface UserProfileI {
  readonly id: string;
  readonly email: string;
  readonly privileges: PrivilegeI[];
}

export interface PrivilegeI {
  readonly company?: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
  readonly team?: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
  readonly role: RoleType;
}
