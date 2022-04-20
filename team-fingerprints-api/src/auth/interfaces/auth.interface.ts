import { RoleType } from 'src/role/role.type';

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
