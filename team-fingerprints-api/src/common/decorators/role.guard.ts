import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserRole } from 'src/users/user.type';

export const RoleGuard = (roles: UserRole[] = []): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const { user } = context.switchToHttp().getRequest();
      return roles.includes(user?.role) || user?.role === UserRole.ADMIN;
    }
  }
  return mixin(RoleGuardMixin);
};
