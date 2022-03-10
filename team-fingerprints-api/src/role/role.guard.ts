import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RoleType } from 'src/role/role.type';

export const RoleGuard = (
  roles: RoleType[] = [],
  canSuperAdmin = true,
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();
      return (
        roles.includes(user?.role) ||
        (user?.role === RoleType.SUPER_ADMIN && canSuperAdmin)
      );
    }
  }
  return mixin(RoleGuardMixin);
};
