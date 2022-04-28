import {
  CallHandler,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { TeamService } from 'src/company/team/team.service';
import { RoleService } from 'src/role/role.service';
import { RoleType } from 'src/role/role.type';

@Injectable()
export class PrivilegesInterceptorMock implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const email = request.user.email;
    const params = request.params;

    const companyId = params.companyId ?? null;
    const teamId = params.teamId ?? null;

    const superAdminRoleDocument = await this.roleService.findRoleDocument({
      email,
      role: RoleType.SUPER_ADMIN,
    });

    if (superAdminRoleDocument) {
      request.roleDocument = superAdminRoleDocument;
      return handler.handle();
    }

    // Handle USER && TEAM LEADER
    if (companyId && teamId) {
      const leaderRoleDocument = await this.roleService.findRoleDocument({
        email,
        companyId,
        teamId,
        role: RoleType.TEAM_LEADER,
      });
      if (leaderRoleDocument) {
        request.roleDocument = leaderRoleDocument;
        return handler.handle();
      }

      const userRoleDocument = await this.roleService.findRoleDocument({
        email,
        companyId,
        teamId,
        role: RoleType.USER,
      });
      if (leaderRoleDocument) {
        request.roleDocument = userRoleDocument;
        return handler.handle();
      }

      const companyAdminRoleDocument = await this.roleService.findRoleDocument({
        email,
        companyId,
        role: RoleType.COMPANY_ADMIN,
      });

      const team = await this.teamService.getTeamById(companyId, teamId);
      if (!team) throw new UnauthorizedException();

      if (companyAdminRoleDocument) {
        request.roleDocument = companyAdminRoleDocument;
        return handler.handle();
      }
    }

    // Handle COMPANY_ADMIN

    if (companyId && (!teamId || teamId.length <= 0)) {
      const companyAdminRoleDocument = await this.roleService.findRoleDocument({
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
      const superAdminRoleDocument = await this.roleService.findRoleDocument({
        email,
        role: RoleType.SUPER_ADMIN,
      });

      if (superAdminRoleDocument) {
        request.roleDocument = superAdminRoleDocument;
        return handler.handle();
      }
    }

    throw new UnauthorizedException();
  }
}
