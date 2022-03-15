import { RoleType } from '../role.type';

export interface RoleI {
  email: string;
  userId: string;
  companyId: string;
  teamId: string;
  role: RoleType;
}
