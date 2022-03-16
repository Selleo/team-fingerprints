import { RoleType } from '../role.type';

export interface RoleI {
  _id?: string;
  email: string;
  userId: string;
  companyId: string;
  teamId: string;
  role: RoleType;
}
