import { Role } from 'src/role/role.type';

export interface UserProfileI {
  readonly role: Role;
  readonly canCreateTeam: boolean;
  readonly company: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
  readonly team: {
    _id: string;
    name: string;
    description?: string | undefined;
  };
}
