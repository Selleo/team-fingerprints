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
    const { companyId } = request.params;

    const roleDocuments = await this.roleService.findAllRoleDocuments({
      email,
      companyId,
    });

    console.log(roleDocuments);

    if (!roleDocuments || roleDocuments.length <= 0)
      throw new UnauthorizedException();

    if (roleDocuments.some((el) => el.role === RoleType.SUPER_ADMIN)) {
      roleDocuments[0].role = RoleType.SUPER_ADMIN;
      request.roleDocument = roleDocuments[0];
    } else if (roleDocuments.some((el) => el.role === RoleType.COMPANY_ADMIN)) {
      roleDocuments[0].role = RoleType.COMPANY_ADMIN;
      request.roleDocument = roleDocuments[0];
    } else if (roleDocuments.some((el) => el.role === RoleType.TEAM_LEADER)) {
      roleDocuments[0].role = RoleType.TEAM_LEADER;
      request.roleDocument = roleDocuments[0];
    } else {
      roleDocuments[0].role = RoleType.USER;
      request.roleDocument = roleDocuments[0];
    }

    return handler.handle();
  }
}
