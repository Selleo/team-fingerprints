import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { Role } from 'src/role/role.type';

export const RoleGuard = (
  roles: Role[] = [],
  canSuperAdmin = true,
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();
      return (
        roles.includes(user?.role) ||
        (user?.role === Role.SUPER_ADMIN && canSuperAdmin)
      );
    }
  }
  return mixin(RoleGuardMixin);
};
