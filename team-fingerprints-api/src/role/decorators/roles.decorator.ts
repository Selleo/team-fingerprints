import { UseInterceptors } from '@nestjs/common';
import { PrivilegesInterceptor } from '../interceptors/Privileges.interceptor';
import { RolesInterceptor } from '../interceptors/Roles.interceptor';
import { RoleType } from '../role.type';

export function Roles(roles: RoleType[] = [], canSuperAdmin = true) {
  return UseInterceptors(
    PrivilegesInterceptor,
    new RolesInterceptor(roles, canSuperAdmin),
  );
}
