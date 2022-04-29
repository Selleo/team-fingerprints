import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleType } from 'team-fingerprints-common';

@Injectable()
export class RolesInterceptor implements NestInterceptor {
  canSuperAdmin = true;
  constructor(private readonly roles: RoleType[], canSuperAdmin: boolean) {
    this.canSuperAdmin = canSuperAdmin;
  }

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const role = request.roleDocument.role;

    if (
      this.roles.includes(role) ||
      (role === RoleType.SUPER_ADMIN && this.canSuperAdmin)
    ) {
      return handler.handle();
    } else {
      throw new UnauthorizedException();
    }
  }
}
