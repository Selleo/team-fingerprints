import {
  CallHandler,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleService } from 'src/role/role.service';
import { RoleType } from '../role.type';

@Injectable()
export class PrivilegesInterceptor implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const email = request.user.email;
    const params = request.params;

    const companyId = params.companyId ?? null;
    const teamId = params.teamId ?? null;

    // Handle USER && TEAM LEADER
    if (companyId && teamId) {
      const leaderRoleDocument = await this.roleService.findOneRoleDocument({
        email,
        companyId,
        teamId,
        role: RoleType.TEAM_LEADER,
      });
      if (leaderRoleDocument) {
        request.roleDocument = leaderRoleDocument;
        return handler.handle();
      }

      const userRoleDocument = await this.roleService.findOneRoleDocument({
        email,
        companyId,
        teamId,
        role: RoleType.USER,
      });
      if (leaderRoleDocument) {
        request.roleDocument = userRoleDocument;
        return handler.handle();
      }
    }

    // Handle COMPANY_ADMIN

    if (companyId && (!teamId || teamId.length <= 0)) {
      const companyAdminRoleDocument =
        await this.roleService.findOneRoleDocument({
          email,
          companyId,
          role: RoleType.COMPANY_ADMIN,
        });

      if (companyAdminRoleDocument) {
        request.roleDocument = companyAdminRoleDocument;
        return handler.handle();
      }
    }

    // Handle SUPER_ADMIN
    if (
      (!companyId || companyId.length <= 0) &&
      (!teamId || teamId.length <= 0)
    ) {
      const superAdminRoleDocument = await this.roleService.findOneRoleDocument(
        {
          email,
          role: RoleType.SUPER_ADMIN,
        },
      );

      if (superAdminRoleDocument) {
        request.roleDocument = superAdminRoleDocument;
        return handler.handle();
      }
    }

    throw new UnauthorizedException();
  }
}
